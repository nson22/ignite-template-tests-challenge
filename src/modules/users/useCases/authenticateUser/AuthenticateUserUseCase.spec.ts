import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository
let authenticateUsersUseCase: AuthenticateUserUseCase
let createUsersUseCase: CreateUserUseCase

describe("Create session use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		authenticateUsersUseCase = new AuthenticateUserUseCase(usersRepository)
		createUsersUseCase = new CreateUserUseCase(usersRepository)
	})

	it("should be possible to create a new session for an existing user", async () => {
		await createUsersUseCase.execute({
			name: "John Doe",
			email: "johndoe@fake.com",
			password: "1234"
		})

		const authenticatedUser = await authenticateUsersUseCase.execute({
			email: "johndoe@fake.com", 
			password: "1234"

		});

		expect(authenticatedUser).toHaveProperty("user")
		expect(authenticatedUser).toHaveProperty("token")
	})

	it("should not be possible to create a new session for an non existing or incorrect email", async () => {
		expect(async () => {
			await authenticateUsersUseCase.execute({
				email: "", 
				password: "1234"
	
			});
		}).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
	})

	it("should not be possible to create a new session for an non existing or incorrect password", async () => {
		await createUsersUseCase.execute({
			name: "John Doe",
			email: "johndoe@fake.com",
			password: "1234"
		})

		expect(async () => {
			await authenticateUsersUseCase.execute({
				email: "John Doe", 
				password: ""
	
			});
		}).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
	})
})