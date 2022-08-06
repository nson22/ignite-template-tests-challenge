import request from "supertest";
import { Connection } from "typeorm";
import { app } from "../../../../app";
import createConnection from "../../../../database/index"


let connection: Connection

describe("Create session controller", () => {
	beforeAll(async () => {
		connection = await createConnection();
		await connection.runMigrations();
	})

	afterAll(async () => {
		await connection.dropDatabase();
		await connection.close();
	});

	it("should be possible to create a new session", async () => {

		await request(app).post("/api/v1/users").send({
			name: "Supertest",
			email: "supertest@jest.org",
			password: "1234"
		})

		const response = await request(app).post("/api/v1/sessions").send({
			email: "supertest@jest.org",
			password: "1234"
		})

		expect(response.body).toHaveProperty("user")
		expect(response.body).toHaveProperty("token")
		
	})
})