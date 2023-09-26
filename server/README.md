# to start project ->
1. download & start mongo
2. npm i
3. npm run start
4. вы прекрасны

# api

# get /oauth/register 

query
1. name - String
2. email -  String
3. password - String
returns token

# get /oauth
query
1. email - String
2. password - String

returns token

# get /oauth/verify

returns Success || Error

# get /project/all

returns Project[]

# get /project
query
1. id - number

returns Project

# post /project
body
{
    name: String
}

returns Success 

# get /project/add_user
query
1. id - Number (project id)
2. user_id - Number

# post /project/create_product
body
{
    id: Number
    begin_date: Number
    ends_date: Number
    payment_date: Number
    supplies_date: Number
    name: String
    price: Number
    provider: String
    units: String
    worker_name: String
    type: 'material' | 'work'
}

returns Success 

#post /project/change_product
body
{
    id: Number
} & {
    product_status: 1 | 2 | 3 | 4
    product_id: Number
} | {
    product_id: Number
    factually: {
        payment_date: Number
        supplies_date: Number
        begin_date: Number
        ends_date: Number
    }
}

returns Success

# post /project/project_status
body
{
    id: Number
    status: 'processing' | 'final'

}

returns Success

# get /dependencies
req
1. id - Number
returns Product[]