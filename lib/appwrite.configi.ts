import * as sdk from "node-appwrite";

// Destructuring necessary environment variables from process.env

export const {
  PROJECT_ID,
  API_KEY,
  DATABASE_ID,
  PATIENT_COLLECTION_ID,
  APPOINTMENT_COLLECTION_ID,
  DOCTOR_COLLECTION_ID,
  NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
  NEXT_PUBLIC_ENDPOINT: ENDPOINT,
} = process.env;

const client = new sdk.Client(); // Configuring the client with endpoint, project ID, and API key from environment variables

client.setEndpoint(ENDPOINT!).setProject(PROJECT_ID!).setKey(API_KEY!);

// Creating instances of various Appwrite services using the configured client

export const databases = new sdk.Databases(client); //For interacting databases
export const storage = new sdk.Storage(client); // For managing storage
export const messaging = new sdk.Messaging(client); // For sending messages
export const users = new sdk.Users(client); // For managing users
