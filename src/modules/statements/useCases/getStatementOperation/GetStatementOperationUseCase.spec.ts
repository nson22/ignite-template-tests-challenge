import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../../../users/useCases/authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"

describe("User create statement use case", () => {
	
let inMemoryUsersRepository: InMemoryUsersRepository
let authenticateUsersUseCase: AuthenticateUserUseCase
let createUsersUseCase: CreateUserUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createStatementUseCase: CreateStatementUseCase

enum OperationType {
	DEPOSIT = 'deposit',
	WITHDRAW = 'withdraw',
  }

	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUsersRepository();
		authenticateUsersUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
		createUsersUseCase = new CreateUserUseCase(inMemoryUsersRepository)
		inMemoryStatementsRepository = new InMemoryStatementsRepository();
		getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
		createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)

	})

	it("should be possible to get statement deposit operation", async () => {
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

		const statement = await createStatementUseCase.execute({
			user_id,
			type: OperationType.DEPOSIT,
			amount: 100,
			description: "deposit"
		})

		const statement_id = statement.id as string

		const operation = await getStatementOperationUseCase.execute({
			user_id,
			statement_id
		})

		expect(operation).toHaveProperty("id")
		expect(operation).toHaveProperty("user_id")
		expect(operation).toHaveProperty("type")
		expect(operation).toHaveProperty("amount")
		expect(operation).toHaveProperty("description")
	})

	it("should be possible to get statement withdraw operation", async () => {
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

		const statement = await createStatementUseCase.execute({
			user_id,
			type: OperationType.WITHDRAW,
			amount: 100,
			description: "Withdraw"
		})

		const statement_id = statement.id as string

		const operation = await getStatementOperationUseCase.execute({
			user_id,
			statement_id
		})

		expect(operation).toHaveProperty("id")
		expect(operation).toHaveProperty("user_id")
		expect(operation).toHaveProperty("type")
		expect(operation).toHaveProperty("amount")
		expect(operation).toHaveProperty("description")
	})

	it("should not be possible to get statement operation for a non existing user", async () => {
		expect(async () => {
			await getStatementOperationUseCase.execute({
				user_id: "",
				statement_id: ""
			})
	
		}).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
	})

	it("should not be possible to get statement operation for a non existing operation", async () => {
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

		expect(async () => {
			await getStatementOperationUseCase.execute({
				user_id,
				statement_id: ""
			})
	
		}).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
	})

})