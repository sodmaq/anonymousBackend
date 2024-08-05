const axios = require("axios");
const { faker } = require("@faker-js/faker");

const API_URL = "http://localhost:8000/api/v1/users/signup";

async function createFakeUser() {
  const password = faker.internet.password();
  const fakeUser = {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: password,
    confirmPassword: password,
  };

  try {
    const response = await axios.post(API_URL, fakeUser);
    console.log(`User ${fakeUser.name} created: `, response.data);
  } catch (error) {
    console.error(
      `Error creating user ${fakeUser.name}: `,
      error.response ? error.response.data : error.message
    );
  }
}

async function createFakeUsers(count) {
  for (let i = 0; i < count; i++) {
    await createFakeUser();
  }
}

createFakeUsers(20); // Create 20 fake users
