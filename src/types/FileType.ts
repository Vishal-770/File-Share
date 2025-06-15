export default interface FileDetails {
  _id: string;
  fileName: string;
  fileType: string;
  size: number;
  createdAt: string;
  fileUrl: string;
  filePath: string;
  password?: string;
  fileId: string;
}
export interface PasswordBody {
  password: string;
  fileUrl: string;
}
export interface ClerkUser {
  backup_code_enabled: boolean;
  banned: boolean;
  create_organization_enabled: boolean;
  created_at: number;
  delete_self_enabled: boolean;
  email_addresses: EmailAddress[];
  enterprise_accounts: EnterpriseAccount[];
  external_accounts: ExternalAccount[];
  external_id: string | null;
  first_name: string;
  has_image: boolean;
  id: string;
  image_url: string;
  last_active_at: number;
  last_name: string;
  last_sign_in_at: number | null;
  legal_accepted_at: number | null;
  locked: boolean;
  lockout_expires_in_seconds: number | null;
  mfa_disabled_at: number | null;
  mfa_enabled_at: number | null;
  object: "user";
  passkeys: Passkey[];
  password_enabled: boolean;
  phone_numbers: PhoneNumber[];
  primary_email_address_id: string;
  primary_phone_number_id: string | null;
  primary_web3_wallet_id: string | null;
  private_metadata: Record<string, unknown>;
  profile_image_url: string;
  public_metadata: Record<string, unknown>;
  saml_accounts: SamlAccount[];
  totp_enabled: boolean;
  two_factor_enabled: boolean;
  unsafe_metadata: Record<string, unknown>;
  updated_at: number;
  username: string | null;
  verification_attempts_remaining: number;
  web3_wallets: Web3Wallet[];
}

interface EmailAddress {
  id: string;
  email_address: string;
  verification: {
    status: "verified" | "unverified" | string;
  };
  linked_to: string[];
  object: "email_address";
}

interface EnterpriseAccount {
  id: string;
  object: "enterprise_account";
  name: string;
  provider: string;
  created_at: number;
}

interface ExternalAccount {
  id: string;
  provider: string;
  provider_user_id: string;
  approved_scopes: string;
  email_address: string;
  first_name: string;
  last_name: string;
  picture: string;
  object: "external_account";
}

interface Passkey {
  id: string;
  name: string;
  created_at: number;
  updated_at: number;
  last_used_at: number | null;
  object: "passkey";
}

interface PhoneNumber {
  id: string;
  phone_number: string;
  reserved_for_second_factor: boolean;
  linked_to: string[];
  object: "phone_number";
  verification: {
    status: "verified" | "unverified" | string;
  };
}

interface SamlAccount {
  id: string;
  provider: string;
  provider_user_id: string;
  object: "saml_account";
}

interface Web3Wallet {
  id: string;
  web3_wallet: string;
  object: "web3_wallet";
}
