export default {
    providers: [
      {
        domain: process.env.CLERK_ISSUER_BASE_URL,
        applicationID: "convex",
      },
    ]
  };