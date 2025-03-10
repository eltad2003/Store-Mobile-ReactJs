const a =
    [
        {
            id,
            title,
            image,
            price,
            description,
            brand,
            model,
            color,
            category,
            popular: true,
            discount,
        }
    ]
const user =
    [
        {
            id,
            email,
            username,
            password,
            name: {
                firstname,
                lastname,
            },
            address: {
                city,
                street,

            },
            phone,
        }
    ]


const review = {
    id: 1,
    productId: 1,
    userId: 1,
    rating: 5,
    title: 'Great product!',
    content: 'Exactly what I was looking for',
    date: '2024-01 - 25'
}

const order =
    [
        {
            id,
            userId,
            items: {
                productId,
                quantity,

            },
            totalPrice,
            status: "delivery",
        }
    ]