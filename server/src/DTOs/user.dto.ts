import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserType {
    @Field()
    readonly username: string;
    @Field()
    readonly password: string;
    @Field()
    readonly email: string;
    @Field()
    readonly photoUrl: string;
}