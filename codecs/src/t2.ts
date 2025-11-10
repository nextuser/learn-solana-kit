type User={
name : string,
age : number,
};
const u1 = {name:"charles",age:44}
const v = u1  satisfies User

console.log(v)
const u2 = { name : "wxh"}
const v2 = u2 satisfies User
console.log(v2)
