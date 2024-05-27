import type { Locale } from "../hooks/use-payment-form-context";

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

type ReasonCode = (typeof REASON_CODES)[keyof typeof REASON_CODES];

type PaymentErrors = {
  [reasonCode in ReasonCode | "default"]: Record<Locale, string>;
};

const paymentErrors: Partial<PaymentErrors> = {
  [REASON_CODES.REASON_3DSECURE_NOT_ENROLLED]: {
    EN: "The card is eligible to participate in 3DS but has not been enrolled. Please try with another card.",
    PT: "O cartão está qualificado para participar do 3DS, mas não foi inscrito. Por favor, tente com outro cartão.",
    ES: "La tarjeta es apta para participar en 3DS pero no se ha inscrito. Inténtelo con otra tarjeta.",
    IT: "La carta è idonea a partecipare al 3DS ma non è stata registrata. Provare con un'altra carta.",
    NL: "De kaart komt in aanmerking voor deelname aan 3DS, maar is niet geregistreerd. Probeer het met een andere kaart.",
    DE: "Die Karte ist zur Teilnahme an 3DS berechtigt, wurde aber nicht angemeldet. Bitte versuchen Sie es mit einer anderen Karte.",
    FR: "La carte est éligible pour participer à 3DS mais n'a pas été inscrite. Veuillez essayer avec une autre carte.",
    PL: "Karta kwalifikuje się do udziału w 3DS, ale nie została zarejestrowana. Spróbuj użyć innej karty.",
    JA: "このカードは3DSに登録可能ですが、まだ登録されていません。別のカードでお試しください。",
  },
  [REASON_CODES.REASON_3DSECURE_INELIGIBLE]: {
    EN: "The card is not eligible to participate in 3DS. Please try with another card.",
    PT: "O cartão não está qualificado para participar do 3DS. Tente com outro cartão.",
    ES: "La tarjeta no puede participar en 3DS. Inténtelo con otra tarjeta.",
    IT: "La carta non è idonea a partecipare al 3DS. Provare con un'altra carta.",
    NL: "De kaart komt niet in aanmerking voor deelname aan 3DS. Probeer het met een andere kaart.",
    DE: "Die Karte ist nicht zur Teilnahme an 3DS berechtigt. Bitte versuchen Sie es mit einer anderen Karte.",
    FR: "La carte n'est pas éligible pour participer à 3DS. Veuillez essayer avec une autre carte.",
    PL: "Karta nie kwalifikuje się do udziału w 3DS. Spróbuj użyć innej karty.",
    JA: "このカードは3DSに参加できません。別のカードでお試しください。",
  },
  [REASON_CODES.REASON_3DSECURE_REJECTED]: {
    EN: "Issuing bank has rejected the 3DS transaction. Please try with another card.",
    PT: "O banco emissor rejeitou a transação 3DS. Tente com outro cartão.",
    ES: "El banco emisor ha rechazado la transacción 3DS. Inténtelo con otra tarjeta.",
    IT: "La banca emittente ha rifiutato la transazione 3DS. Provare con un'altra carta.",
    NL: "De bank van afgifte heeft de 3DS-transactie geweigerd. Probeer het met een andere kaart.",
    DE: "Die kartenausgebende Bank hat die 3DS-Transaktion abgelehnt. Bitte versuchen Sie es mit einer anderen Karte.",
    FR: "La banque émettrice a rejeté la transaction 3DS. Veuillez essayer avec une autre carte.",
    PL: "Bank wydający kartę odrzucił transakcję 3DS. Spróbuj użyć innej karty.",
    JA: "発行銀行が3DSの取引を拒否しました。別のカードでお試しください。",
  },
  [REASON_CODES.REASON_3DSECURE_FRICTIONLESS_FAILED_AUTH]: {
    EN: "3DS Authentication failed. Please try with another card.",
    PT: "A autenticação 3DS falhou. Tente com outro cartão.",
    ES: "Ha fallado la autenticación 3DS. Inténtelo con otra tarjeta.",
    IT: "Autenticazione 3DS fallita. Provare con un'altra carta.",
    NL: "3DS-authenticatie is mislukt. Probeer het met een andere kaart.",
    DE: "3DS-Authentifizierung fehlgeschlagen. Bitte versuchen Sie es mit einer anderen Karte.",
    FR: "L'authentification 3DS a échoué. Veuillez essayer avec une autre carte.",
    PL: "Uwierzytelnianie 3DS nie powiodło się. Spróbuj użyć innej karty.",
    JA: "3DS認証に失敗しました。別のカードでお試しください。",
  },
  [REASON_CODES.REASON_3DSECURE_SCA_REQUIRED]: {
    EN: "3DS Authentication failed. Please try again.",
    PT: "A autenticação 3DS falhou. Tente novamente.",
    ES: "Error de autenticación 3DS. Vuelva a intentarlo.",
    IT: "Autenticazione 3DS fallita. Si prega di riprovare.",
    NL: "3DS-authenticatie is mislukt. Probeer het opnieuw.",
    DE: "3DS-Authentifizierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    FR: "L'authentification 3DS a échoué. Veuillez réessayer.",
    PL: "Uwierzytelnianie 3DS nie powiodło się. Spróbuj ponownie.",
    JA: "3DS認証に失敗しました。もう一度やり直してください。",
  },
  [REASON_CODES.REASON_BLOCKED_CARD_CATEGORY]: {
    EN: "Unfortunately we do not accept prepaid cards. Please try adding another card to continue.",
    PT: "Infelizmente, não aceitamos cartões pré-pagos. Tente adicionar outro cartão para continuar.",
    ES: "Lamentablemente, no aceptamos tarjetas de prepago. Intente añadir otra tarjeta para continuar.",
    IT: "Purtroppo non accettiamo carte prepagate. Provi ad aggiungere un'altra carta per continuare.",
    NL: "Helaas accepteren we geen prepaid kaarten. Probeer een andere kaart toe te voegen om verder te gaan.",
    DE: "Leider können wir keine Prepaid-Karten akzeptieren. Bitte versuchen Sie, eine andere Karte hinzuzufügen, um fortzufahren.",
    FR: "Malheureusement, nous n'acceptons pas les cartes prépayées. Veuillez essayer d'ajouter une autre carte pour continuer.",
    PL: "Niestety nie akceptujemy kart przedpłaconych. Spróbuj dodać inną kartę, aby kontynuować.",
    JA: "残念ながらプリペイドカードはご利用いただけません。他のカードを追加してください。",
  },
  default: {
    EN: "A payment error occurred, please try again.",
    PT: "Ocorreu um erro de pagamento, tente novamente.",
    ES: "Se ha producido un error en el pago, inténtelo de nuevo.",
    IT: "Si è verificato un errore di pagamento, riprovare.",
    NL: "Er is een betalingsfout opgetreden, probeer het opnieuw.",
    DE: "Es ist ein Zahlungsfehler aufgetreten, bitte versuchen Sie es erneut.",
    FR: "Une erreur de paiement s'est produite, veuillez réessayer.",
    PL: "Wystąpił błąd płatności, spróbuj ponownie.",
    JA: "支払いエラーが発生しました。",
  },
};

export const determineError = (
  reasonCode: string,
  locale: Locale = "EN"
): string => {
  return (
    paymentErrors[reasonCode as ReasonCode]?.[locale] ||
    paymentErrors.default?.[locale] ||
    ""
  );
};
