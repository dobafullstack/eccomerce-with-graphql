import { Query, Resolver } from 'type-graphql';

@Resolver()
export default class Hello {
    @Query((_return) => String)
    hello() {
        return 'Hello Doba';
    }
}
