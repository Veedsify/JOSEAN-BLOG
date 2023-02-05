const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_PUBLIC_KEY)

router.get('/', (req, res) => {
    res.render('pages-pricing')
})

let userFee = new Map([
    [1, { priceInCents: 74000, name: 'BloggyStories Premium Account' }]
])



router.post('/user', async (req, res) => {

    let plan = req.body.plan

    req.session.plan = plan

    console.log(req.body.plan)

    switch (req.session.plan) {
        case 'paid':
            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    mode: 'payment',
                    line_items: req.body.items.map(item => {
                        const userFeeData = userFee.get(item.id)
                        return {
                            price_data: {
                                currency: 'inr',
                                product_data: {
                                    name: userFeeData.name
                                },
                                unit_amount: userFeeData.priceInCents
                            },
                            quantity: item.quantity
                        }
                    }),
                    success_url: `${process.env.SERVER_URL}/register`,
                    cancel_url: `${process.env.SERVER_URL}/register/pay/canceled`
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