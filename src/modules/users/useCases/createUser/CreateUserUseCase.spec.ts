import { User } from "../../entities/User"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

let usersRepository: InMemoryUsersRepository
let createUsersUseCase: CreateUserUseCase

describe("Create User Use Case", () => {
	beforeEach(()=> {
		usersRepository = new InMemoryUsersRepository();
		createUsersUseCase = new CreateUserUseCase(usersRepository)
	})

	it("should be able to create a new user", async () => {
		const user = await createUsersUseCase.execute({
			name: "John Doe",
			email: "johndoe@fake.com",
			password: "1234"
		});

		expect(user).toHaveProperty("id")
		expect(user).toHaveProperty("name")
		expect(user).toHaveProperty("email")
		
	})

	it("should not be able to create a new user if user already exists.", async () => {
		await createUsersUseCase.execute({
			name: "John Doe",
			email: "johndoe@fake.com",
			password: "1234"
		});

		expect(async () => {
			await createUsersUseCase.execute({
				name: "John Doe",
				email: "johndoe@fake.com",
				password: "1234"
			});
		}).rejects.toBeInstanceOf(CreateUserError)
	})
})