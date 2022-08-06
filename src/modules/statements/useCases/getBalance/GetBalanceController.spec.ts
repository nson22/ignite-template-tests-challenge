import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index"


let connection: Connection

describe("User statement and balance controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	})

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it("should be possible to get user statement and balance", async () => {

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

		const response = await request(app).get("/api/v1/statements/balance").set({
			Authorization: `Bearer ${token}`
		})

		expect(response.body).toHaveProperty("statement")
		expect(response.body).toHaveProperty("balance")
		expect(response.body.statement.length).toBeGreaterThanOrEqual(0)
		expect(response.body.balance).toEqual(0)
		
	})
})