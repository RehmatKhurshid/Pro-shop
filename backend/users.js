import bycrypt from 'bcryptjs'
const users = [
    {
        name: "danish",
        email: "danish@gmail.com",
        password: bycrypt.hashSync('12345', 10),
        isAdmin : true
    },
    {
        name: "jhon",
        email: "jhon@gmail.com",
        password: bycrypt.hashSync('12345', 10),
    },
    {
        name: "jane",
        email: "jane@gmail.com",
        password: bycrypt.hashSync('12345', 10),
    },
]

export default users;