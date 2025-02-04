import { faker } from '@faker-js/faker'

function createMockProduct() {
const code = faker.string.alphanumeric(10);
const title = faker.commerce.productName();
const description = faker.commerce.fakerDescription();
const price = faker.commerce.price({ min: 100, max: 200, dec: 2 })
const category = faker.commerce.department();
const stock = faker.number.int({ min: 0, max: 500 });
const status = faker.datatype.boolean();
const thumbnail = faker.image.url({width: 500, height: 500 })
return {code, title, description, price, category, stock, status, thumbnail}
}

export { createMockProduct }