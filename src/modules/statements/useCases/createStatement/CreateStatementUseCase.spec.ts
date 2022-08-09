import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

describe("User create statement use case", () => {
	
let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUsersUseCase: AuthenticateUserUseCase
let createUsersUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository

enum OperationType {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
  }

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		authenticateUsersUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
		createUsersUseCase = new CreateUserUseCase(inMemoryUsersRepository)
		inMemoryStatementsRepository = new InMemoryStatementsRepository();
		createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
	})

	it("should be possible set deposit statement", async () => {
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

		const operation = await createStatementUseCase.execute({
			user_id,
			type: OperationType.DEPOSIT,
			amount: 100,
			description: "deposit"
		})

		expect(operation).toHaveProperty("id")
		expect(operation).toHaveProperty("user_id")
		expect(operation).toHaveProperty("type")
		expect(operation).toHaveProperty("amount")
		expect(operation).toHaveProperty("description")
		
	})

	it("should be possible set withdraw statement", async () => {
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

		await createStatementUseCase.execute({
			user_id,
			type: OperationType.DEPOSIT,
			amount: 100,
			description: "deposit"
		})

		const operation = await createStatementUseCase.execute({
			user_id,
			type: OperationType.WITHDRAW,
			amount: 50,
			description: "withdraw"
		})

		expect(operation).toHaveProperty("id")
		expect(operation).toHaveProperty("user_id")
		expect(operation).toHaveProperty("type")
		expect(operation).toHaveProperty("amount")
		expect(operation).toHaveProperty("description")
		
	})

	it("should not be possible to do an operation with a non existing user", async () => {
		expect( async () => {
			await createStatementUseCase.execute({
				user_id: "",
				type: OperationType.WITHDRAW,
				amount: 50,
				description: "withdraw"
			})
		}).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
		
	})

	it("should not be possible to withdraw with no found", async () => {
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

		expect( async () => {
			await createStatementUseCase.execute({
				user_id,
				type: OperationType.WITHDRAW,
				amount: 50,
				description: "withdraw"
			})
		}).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
		
	})

})