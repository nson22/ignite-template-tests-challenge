import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index"


let connection: Connection

describe("User statement operation controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	})

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it("should be possible to user get statement of deposit operation", async () => {

		await request(app).post("/api/v1/users").send({
			name: "Supertest",
			email: "supertest@jest.org",
			password: "1234"
		})

		const responseToken = await request(app).post("/api/v1/sessions").send({
			email: "supertest@jest.org",
			password: "1234"
		})

		const { token } = responseToken.body

		const response = await request(app).post("/api/v1/statements/deposit").send({
			amount: 500,
			description: "Save" 
		}).set({
			Authorization: `Bearer ${token}`
		})

		const responseOperation = await request(app).get(`/api/v1/statements/${response.body.id}`).set({
			Authorization: `Bearer ${token}`
		})

		expect(responseOperation.body).toHaveProperty("id")
		expect(responseOperation.body).toHaveProperty("user_id")
		expect(responseOperation.body).toHaveProperty("description")
		expect(responseOperation.body).toHaveProperty("amount")
		expect(responseOperation.body).toHaveProperty("type")
		expect(responseOperation.body).toHaveProperty("created_at")
		expect(responseOperation.body).toHaveProperty("updated_at")

	})

	it("should be possible to user get statement of withdraw operation", async () => {

		await request(app).post("/api/v1/users").send({
			name: "Supertest",
			email: "supertest@jest.org",
			password: "1234"
		})

		const responseToken = await request(app).post("/api/v1/sessions").send({
			email: "supertest@jest.org",
			password: "1234"
		})

		const { token } = responseToken.body

		const response = await request(app).post("/api/v1/statements/withdraw").send({
			amount: 500,
			description: "Save" 
		}).set({
			Authorization: `Bearer ${token}`
		})

		const responseOperation = await request(app).get(`/api/v1/statements/${response.body.id}`).set({
			Authorization: `Bearer ${token}`
		})

		expect(responseOperation.body).toHaveProperty("id")
		expect(responseOperation.body).toHaveProperty("user_id")
		expect(responseOperation.body).toHaveProperty("description")
		expect(responseOperation.body).toHaveProperty("amount")
		expect(responseOperation.body).toHaveProperty("type")
		expect(responseOperation.body).toHaveProperty("created_at")
		expect(responseOperation.body).toHaveProperty("updated_at")

	})

})