import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

describe("User statement and balance use case", () => {
	
let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUsersUseCase: AuthenticateUserUseCase
let createUsersUseCase: CreateUserUseCase
let getBalanceUserCase: GetBalanceUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		authenticateUsersUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
		createUsersUseCase = new CreateUserUseCase(inMemoryUsersRepository)
		inMemoryStatementsRepository = new InMemoryStatementsRepository();
		getBalanceUserCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
	})

	it("should be possible to get user balance", async () => {
		await createUsersUseCase.execute({
			name: "John Doe",
			email: "johndoe@fake.com",
			password: "1234"
		})

		const authenticatedUser = await authenticateUsersUseCase.execute({
			email: "johndoe@fake.com", 
			password: "1234"

		});

		const user_id = authenticatedUser.user.id as string
		
		const balance = await getBalanceUserCase.execute({user_id})

		expect(balance).toHaveProperty("statement")
		expect(balance).toHaveProperty("balance")
		
	})

	it("should not be possible to get balance for a non existing user", async () => {
		expect(async () => {
			await getBalanceUserCase.execute({user_id: "user_id"})
		}).rejects.toBeInstanceOf(GetBalanceError)
		
	})
})