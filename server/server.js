import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const users = [
  { id: 1, name: "Disha Patel", age: 30, isMarried: true },
  { id: 2, name: "Bhavesh Patel", age: 23, isMarried: false },
  { id: 3, name: "Harsh Parmar", age: 29, isMarried: true },
];

const typeDefs = `
  type Query {
    getUsers: [User]
    getUserById(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, age: Int!, isMarried: Boolean!): User
  }
  
  type User {
    id: ID
    name: String
    age: Int
    isMarried: Boolean
  }
`;

const resolvers = {
  Query: {
    getUsers: () => users,
    getUserById: (parent, args) => {
      const id = parseInt(args.id); // Convert id to number
      return users.find(user => user.id === id);
    }
  },
  Mutation: {
    createUser: (parent, args) => {
      const { name, age, isMarried } = args;
      const newUser = {
        id: users.length + 1, // ID should be a number
        name,
        age,
        isMarried
      };
      users.push(newUser);
      return newUser; // Return the newly created user
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`Server running at: ${url}`);
