import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class Userinput {
    @Field()
    readonly username: string;
    @Field()
    readonly password: string;
    @Field()
    readonly email: string;
    @Field()
    readonly photoUrl: string;
}