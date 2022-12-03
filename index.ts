import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { GraphQLError } from "graphql";

// Apollo Server
// GraphQL type definitions
// Resolvers

// dataset
const books = [
    {
        title: 'Cooper Codes, The Best Tech Youtuber?',
        author: 'Cooper Codes',
        id: 1
    },
    {
        title: 'Learn TypeScript',
        author: 'John Doe',
        id: 2
    }
];

// typedefs
const typeDefs = `#graphql
    type Book {
        title: String
        author: String
        id: Int
    }

    type Query {
        books: [Book]
        getBooksByAuthor(author: String): [Book]
        getBookByID(id: Int): Book
    }
`

// resolvers
const resolvers = {
    Query: {
        books: () => books,
        getBooksByAuthor: (_parent, args) => {
            // args -> { author: "Cooper Codes" }
            const authorBooks = books.filter(book => book.author === args.author);

            if (authorBooks.length > 0) {
                return authorBooks;
            } else {
                // Throw error
                throw new GraphQLError('There are no books with the author ' + args.author, {
                    extensions: {
                        code: "BOOKS_NOT_FOUND"
                    }
                });
            }
        },
        getBookByID: (_parent, args) => {
            const bookIndex = books.findIndex(book => book.id === args.id);
            
            if(bookIndex !== -1) {
                return books[bookIndex];
            } else {
                throw new GraphQLError('There is no book with the id ' + args.id, {
                    extensions: {
                        code: "BOOK_NOT_FOUND"
                    }
                });
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
});
