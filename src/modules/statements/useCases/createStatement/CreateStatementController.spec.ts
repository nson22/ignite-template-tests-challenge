import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index"


let connection: Connection

describe("User statement and deposit controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	})

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it("should be possible to get user deposit an amount value to his balance", async () => {

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

		expect(response.status).toBe(201)
		expect(response.body).toHaveProperty("id")
		expect(response.body).toHaveProperty("user_id")
		expect(response.body).toHaveProperty("description")
		expect(response.body).toHaveProperty("amount")
		expect(response.body).toHaveProperty("type")
		expect(response.body).toHaveProperty("created_at")
		expect(response.body).toHaveProperty("updated_at")
		
	})

	it("should be possible to get user withdraw an amount value to his balance", async () => {

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

		expect(response.status).toBe(201)
		expect(response.body).toHaveProperty("id")
		expect(response.body).toHaveProperty("user_id")
		expect(response.body).toHaveProperty("description")
		expect(response.body).toHaveProperty("amount")
		expect(response.body).toHaveProperty("type")
		expect(response.body).toHaveProperty("created_at")
		expect(response.body).toHaveProperty("updated_at")
		
	})
})