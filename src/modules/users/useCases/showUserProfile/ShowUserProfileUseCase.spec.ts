import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepository: InMemoryUsersRepository
let authenticateUsersUseCase: AuthenticateUserUseCase
let createUsersUseCase: CreateUserUseCase
let showUserProfileUseCase: ShowUserProfileUseCase

describe("Create show user profile use case", () => {
	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository)
		authenticateUsersUseCase = new AuthenticateUserUseCase(usersRepository)
		createUsersUseCase = new CreateUserUseCase(usersRepository)
	})

	it("should be possible to show user profile", async () => {
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
		const user = await showUserProfileUseCase.execute(user_id)

		expect(user).toHaveProperty("id")
		expect(user).toHaveProperty("name")
		expect(user).toHaveProperty("email")
		expect(user).toHaveProperty("password")
		
	})

	it("should not be possible to show user profile if user does not exits", async () => {
		expect(async () => {
			await showUserProfileUseCase.execute("user_id")
		}).rejects.toBeInstanceOf(ShowUserProfileError)
		
	})
})