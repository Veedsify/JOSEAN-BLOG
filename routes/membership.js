const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_PUBLIC_KEY)

router.get('/', (req, res) => {
    let SERVER_URL = req.protocol + '://' + req.get('host')
    if (req.session.plan === 'paid') {
        return res.redirect('/register?session=paid')
    }
    const data = {
        plan: 'price_1MaoN4IdV652my8rdX5I2GC3',
        public_key: process.env.STRIPE_PUBLIC_KEY,
        success: `${SERVER_URL}/register/pay?paid=success`,
        cancel: `${SERVER_URL}/register/pay/canceled`
    }
    res.render('pages-pricing', data)
})

let userFee = new Map([
    [1, { priceInCents: process.env.STRIPE_PRICE, name: 'BloggyStories Premium Account' }]
])


router.get('/user-upgrade', async (req, res) => {
    let user = req.session.user.user_name


    let items = [{ id: 1, quantity: 1 }]

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: [process.env.PAYMENT_METHOD_TYPE],
            mode: 'payment',
            line_items: items.map(item => {
                const userFeeData = userFee.get(item.id)
                return {
                    price_data: {
                        currency: process.env.STRIPE_CURRENCY,
                        product_data: {
                            name: userFeeData.name
                        },
                        unit_amount: userFeeData.priceInCents
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${SERVER_URL}/update/payed`,
            cancel_url: `${SERVER_URL}/login/ended`
        })

        res.redirect(session.url)
    } catch (e) {
        console.log(e)
        req.session.destroy()
        res.redirect('/')
    }
})

router.post('/user', async (req, res) => {

    let SERVER_URL = req.protocol + '://' + req.get('host')

    let plan = req.body.plan

    req.session.plan = plan

    console.log(req.body.plan)

    switch (req.session.plan) {
        case 'paid':
            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: [process.env.PAYMENT_METHOD_TYPE],
                    mode: 'payment',
                    line_items: req.body.items.map(item => {
                        const userFeeData = userFee.get(item.id)
                        return {
                            price_data: {
                                currency: process.env.STRIPE_CURRENCY,
                                product_data: {
                                    name: userFeeData.name
                                },
                                unit_amount: userFeeData.priceInCents
                            },
                            quantity: item.quantity
                        }
                    }),
                    success_url: `${SERVER_URL}/register`,
                    cancel_url: `${SERVER_URL}/register/pay/canceled`
                })
                res.json({
                    type: 'link',
                    link: session.url
                })
            } catch (e) {
                console.log(e)
                req.session.destroy()
                res.json({
                    type: 'link',
                    link: '/'
                })
            }

            break;
        case 'free':
            res.json({
                type: 'link',
                link: '/register'
            })
            break;
    }
})


module.exports = router