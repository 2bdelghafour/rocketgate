export const REASON_CODES = {
  /** The card is enrolled in 3D Secure. The 3DS sequence must be performed. */
  REASON_3DSECURE_AUTHENTICATION_REQUIRED: "202",
  /** The card is eligible to participate in 3D Secure, however, it has not been enrolled. */
  REASON_3DSECURE_NOT_ENROLLED: "203",
  /** The card is not eligible to participate in 3D Secure. */
  REASON_3DSECURE_INELIGIBLE: "204",
  /** The system can not determine whether or not the card is enrolled in 3D Secure. */
  REASON_3DSECURE_REJECTED: "205",
  /** This indicates the current transaction was processed by gateway as a BIN intelligence/device fingerprinting. */
  REASON_3DSECURE_INITIATION: "225",
  /** Cardholder failed authentication */
  REASON_3DSECURE_FRICTIONLESS_FAILED_AUTH: "227",
  /** Transaction requires 3-D Secure authentication or a valid SCA exemption. */
  REASON_3DSECURE_SCA_REQUIRED: "228",
  /** The card category is blocked */
  REASON_BLOCKED_CARD_CATEGORY: "206",
} as const;

export const determineError = (reasonCode: string): string => {
  switch (reasonCode) {
    case REASON_CODES.REASON_3DSECURE_NOT_ENROLLED:
      return "The card is eligible to participate in 3DS but has not been enrolled. Please try with another card.";
    case REASON_CODES.REASON_3DSECURE_INELIGIBLE:
      return "The card is not eligible to participate in 3DS. Please try with another card.";
    case REASON_CODES.REASON_3DSECURE_REJECTED:
      return "Issuing bank has rejected the 3DS transaction. Please try with another card.";
    case REASON_CODES.REASON_3DSECURE_FRICTIONLESS_FAILED_AUTH:
      return "3DS Authentication failed. Please try with another card.";
    case REASON_CODES.REASON_3DSECURE_SCA_REQUIRED:
      return "3DS Authentication failed. Please try again.";
    case REASON_CODES.REASON_BLOCKED_CARD_CATEGORY:
      return "Unfortunately we do not accept prepaid cards. Please try adding another card to continue.";
    default:
      return "A payment error occurred, please try again.";
  }
};
