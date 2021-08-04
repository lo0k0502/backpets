import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserType } from "src/DTOs/user.dto";
import { Userinput } from "src/inputs/user.input";
import { UserService } from "src/services/user.service";

@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService
  ) {}

  @Query(() => String)
  async user() {
    return 'hello';
  }

  @Query(() => [UserType])
  async users() {
    return this.userService.findAll();
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: Userinput) {
    return this.userService.create(input);
  }
}