'use strict'
const AWS = require('aws-sdk')
const sns = new AWS.SNS()
const request = require('request')
const url = 'https://www.apple.com/shop/refurbished/mac/256gb-macbook-pro-16gb'

module.exports.handler = (event, context) => {
    let response = ''

    request(url, (err, resp, html) => {
        html = html.replace(/([^]*)"tiles":/, '').trim()
        if (html.indexOf('legend') >= 0)
            html = html.replace(/"legend"([^]*)/, '')
        
        if (html.indexOf('dimensions') >= 0)
            html = html.replace(',"dimensions":[{', '')
        
        if (html.indexOf('staticAssets') >= 0)
            html = html.replace(/"staticAssets"([^] *)/, '')
        
        if (html === '')
            return context.succeed('Error Parsing')
        

        if (html.substr(html.length - 1, 1) === ',') html = html.substr(0, html.length - 1)
        
        try {
            const products = JSON.parse(html)
            let title
            let price
            let ram
            let diskSpace
    
            products.forEach(product => {
                title = ''
                price = product.price['currentPrice'].amount
                ram = 0
                diskSpace = 0
                
                if (price.indexOf('$1,0') >= 0 || price.indexOf('$1,1') >= 0 || price.indexOf('$1,2') >= 0 || price.indexOf('$1,3') >= 0 || price.indexOf('$1,4') >= 0) {
                    if (product.title.toLowerCase().indexOf('macbook') >= 0 &&
                        product.title.toLowerCase().indexOf('pro') >= 0 &&
                        product.title.toLowerCase().indexOf('13.3') >= 0) {
    
                        title = product.title.replace('Refurbished ', '')
                        title = title.replace(' Intel Core ', ' ')
                        title = title.replace(' with Retina display ', ' ')
                        title = title.replace(' - Space Gray', ' ')
                        title = title.replace(' - Silver', ' ')
                        title = title.replace(' and Radeon Pro Vega 16', '')
                        title = title.replace(' and Radeon Pro Vega 20', '')
                        title = title.replace(' with Retina Display', '')
                        title = title.replace(' i5', '')
                        title = title.replace(' i7', '')
                        title = title.replace(' i9', '')
                        title = title.replace(' Dual-core', '')
                        title = title.replace(' dual-core', '')
                        title = title.replace(' Quad-core', '')
                        title = title.replace(' quad-core', '')
                        title = title.replace(' 6-core', '')
                        title = title.replace('13.3-inch ', '').trim()
    
                        Object.keys(product).forEach((item) => {
                            if (item === 'filters') {
                                ram = product.filters['dimensions'].tsMemorySize
                                diskSpace = product.filters['dimensions'].dimensionCapacity
                            }
                        })
        
                        if (ram !== '8gb' && diskSpace !== '128gb') response = `https://www.apple.com${product.productDetailsUrl}`
                    }
                }
            })
            
            if (response !== '')
            {
                sns.publish({
                    Message: 'Macbook Pro ' + response,
                    MessageAttributes: {
                        'AWS.SNS.SMS.SMSType': {
                            DataType: 'String',
                            StringValue: 'Promotional'
                        },
                        'AWS.SNS.SMS.SenderID': {
                            DataType: 'String',
                            StringValue: 'Promotional'
                        },
                    },
                    PhoneNumber: process.env.PhoneNumber
                }).promise().then(data => {
                    return context.succeed('Text Message Sent')
                }).catch(err => {
                    return context.succeed('An Error Occurred ' + err)
                })
            }
        } catch(e) {
            return context.succeed('Parsing error')
        }
    })
}
