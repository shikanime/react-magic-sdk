import {
  GenerateIdTokenConfiguration,
  LoginWithMagicLinkConfiguration,
  Magic as MagicClient,
  MagicSDKAdditionalConfiguration,
  MagicUserMetadata,
  UpdateEmailConfiguration,
} from "magic-sdk";
import { useEffect, useMemo, useState } from "react";

export interface Magic {
  idToken: string | null;
  isLoggedIn: boolean;
  userMetadata: MagicUserMetadata | null;
  loginWithCredential(credentialOrQueryString?: string): Promise<void>;
  loginWithMagicLink(
    configuration: LoginWithMagicLinkConfiguration
  ): Promise<void>;
  logout(): Promise<void>;
  updateEmail(configuration: UpdateEmailConfiguration): Promise<void>;
  generateIdToken(
    configuration?: GenerateIdTokenConfiguration
  ): Promise<string>;
}

export type MagicSDKConfiguration = MagicSDKAdditionalConfiguration & {
  apiKey: string;
};

export function useMagic({ apiKey, ...options }: MagicSDKConfiguration): Magic {
  const magic = useMemo(
    () => new MagicClient(apiKey, options),
    [apiKey, options]
  );
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userMetadata, setUserMetadata] = useState<MagicUserMetadata | null>(
    null
  );
  useEffect(() => {
    magic.user.isLoggedIn().then((isLoggedIn) => {
      setIsLoggedIn(isLoggedIn);
    });
  }, []);
  useEffect(() => {
    if (isLoggedIn) {
      magic.user.getIdToken().then((idToken) => {
        setIdToken(idToken);
      });
      magic.user.getMetadata().then((metadata) => {
        setUserMetadata(metadata);
      });
    }
  }, [isLoggedIn]);
  return {
    idToken,
    isLoggedIn,
    userMetadata,
    async loginWithCredential(credentialOrQueryString?: string) {
      const idToken = await magic.auth.loginWithCredential(
        credentialOrQueryString
      );
      setIdToken(idToken);
      setIsLoggedIn(true);
    },
    async loginWithMagicLink(configuration: LoginWithMagicLinkConfiguration) {
      const idToken = await magic.auth.loginWithMagicLink(configuration);
      setIdToken(idToken);
      setIsLoggedIn(true);
    },
    async logout() {
      await magic.user.logout();
      setIdToken(null);
      setUserMetadata(null);
    },
    async updateEmail(configuration: UpdateEmailConfiguration) {
      await magic.user.updateEmail(configuration);
    },
    async generateIdToken(configuration?: GenerateIdTokenConfiguration) {
      return await magic.user.generateIdToken(configuration);
    },
  };
}
