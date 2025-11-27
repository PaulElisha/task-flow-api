/** @format */

export const Provider = {
  GOOGLE: "GOOGLE",
  GITHUB: "GITHUB",
  FACEBOOK: "FACEBOOK",
  EMAIL: "EMAIL",
} as const;

export type ProviderType = (typeof Provider)[keyof typeof Provider];
