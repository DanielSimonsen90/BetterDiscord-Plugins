import { PremiumTypes, Snowflake, User } from "@discord"
import { Finder } from "@discordium/api"

export enum SubscriptionStatusTypes {
    UNPAID,
    ACTIVE,
    PAST_DUE,
    CANCELLED,
    ENDED,
    ACCOUNT_HOLD
}
export type PaymentGateways = {
    STRIPE: 1,
    BRAINTREE: 2,
    APPLE: 3,
    GOOGLE: 4,
    ADYEN: 5,
}
export const PaymentGateways: PaymentGateways = Finder.byProps("PaymentGateways");

type SubscriptionPlanStrings = 
    `NONE_${'3_' | '6_' | ''}MONTH` | 'NONE_YEAR' |
    `PREMIUM_${3 | 6}_MONTH_${'GUILD' | 'TIER_2'}` |
    `PREMIUM_${'MONTH' | 'YEAR'}_${'GUILD' | 'LEGACY' | `TIER_${1 |2}`}` | 'PREMIUM_MONTH_TIER_0'

export type SubscriptionPlans = {
    [key in SubscriptionPlanStrings]: string;
};
export const SubscriptionPlans: SubscriptionPlans = Finder.byProps("SubscriptionPlans");

export type PlanId = SubscriptionPlans[keyof SubscriptionPlans];
export type SubscriptionPlanInfo = {
    [Key in PlanId]: {
        id: string,
        interval: number,
        intervalCount: number,
        name: string,
        premiumType: number,
        skuId: string,
    }
}
export const SubscriptionPlanInfo: SubscriptionPlanInfo = Finder.byProps("SubscriptionPlanInfo");

export enum PriceSetAssignmentPurchaseTypes {
    DEFAULT,
    GIFT,
    SALE,
    PREMIUM_TIER_1,
    PREMIUM_TIER_2
}

type Interval = {
    interval: number,
    intervalCount: number,
}

export enum SubscriptionIntervalTypes {
    MONTH,
    YEAR,
    DAY
}
export enum InvoiceStatusTypes {
    OPEN = 1,
    PAID,
    VOID,
    UNCOLLECTIBLE
}

export type Subscription = {
    paymentSourceId: string,
    isPurchasedExternally: boolean,
    status: SubscriptionStatusTypes,
    latestInvoice: InvoiceStatusTypes
}

export type PremiumSubscriptionSKUs = Record<'GUILD' | 'LEGACY' | 'NONE' | `TIER_${0 | 1 | 2}`, string>;
export const PremiumSubscriptionSKUs = Finder.byProps("PremiumSubscriptionSKUs");

export type Invoice = {
    planId: PlanId,
    status: SubscriptionStatusTypes,
    subscriptionPlanId: string,
}
export type InvoicePreview = {
    invoiceItems: Array<Invoice>
}

export type NitroUtils = Record<
    'canEditDiscriminator' |
    'canInstallPremiumApplications' |
    'canRedeemPremiumPerks' |
    'canUploadAnimatedAvatar' |
    'canUploadLargeFiles' |
    'canUseAnimatedAvatar' |
    'canUseAnimatedEmojis' |
    'canUseBadges' |
    'canUseCustomBackgrounds' |
    'canUseEmojisEverywhere' |
    'canUseHigherFramerate' |
    'canUseIncreaseGuildCap' |
    'canUseIncreaseMessageLength' |
    'canUsePremiumGuildMemberProfile' |
    'canUsePremiumProfileCusomization' |
    'canUseStickersEverywhere' |
    'hasBoostDiscount'
, (user: User) => boolean> & {
    getBillingInformationString(e: {
        status?: SubscriptionStatusTypes,
        isPurchasedViaGoogle?: boolean,
        paymentGateway?: PaymentGateways,
        currentPeriodStart?: Date,
    }, t: {
        total: number,
        /** Expects lowercase */
        currency: string,
        subscriptionPeriodStart?: Date,
    }): [
        "Your subscriptions will automatically renew on ",
        /** This includes date formatted as "Jan 1, 1970" */
        React.ReactElement<any, "strong">,
        " and you'll be charged ",
        /** String of money to pay in provided currency */
        React.ReactElement<any, "strong">,
        "."
    ];
    /** Get Nitro <interval> */
    getBillingReviewSubheader(
        e: null | any, 
        t: { intervalCount: number, id: SubscriptionPlans } | null, 
        isSelecting?: boolean,
    ): string;
    getClosestUpgrade(subscriptionPlanId: PlanId): PlanId;
    getDefaultPrice(options: { currency?: string }, purchaseType: PriceSetAssignmentPurchaseTypes, subscriptionId: string): {
        amount: number,
        tax: number,
        currency: string,
        taxInclusive: boolean,
    }
    getDisplayName(subscriptionPlan: SubscriptionPlanStrings, trial?: boolean, oneMonth?: boolean, duration?: number): string;
    getDisplayPremiumType(subscriptionPlan: SubscriptionPlanStrings, includeNitroString?: boolean): string;
    getInterval(subscriptionPlanId: keyof SubscriptionPlanInfo): Interval
    getIntervalForInvoice(invoicePreview: InvoicePreview): Interval;
    getIntervalMonths(subscriptionIntervalType: SubscriptionIntervalTypes, months: number): number;
    getIntervalString(subscriptionIntervalType: SubscriptionIntervalTypes, modalView?: boolean, orModalView?: boolean, intervalCount?: number): string
    getIntervalStringAsNoun(subscriptionIntervalType: SubscriptionIntervalTypes): string;
    getPlanDescription(plan: {
        subscription: Subscription,
        planId: PlanId,
        price: number,
        includePremiumGuilds?: boolean,
    }): string;
    getPlanIdFromInvoice(invoice: Invoice, invoicePreview: InvoicePreview): string;
    getPremiumGuildIntervalPrice(planId: PlanId, paymentSourceId: string | null, currency: number, r: any): number;
    getPremiumPlanOptions(premiumSKUTier: PremiumSubscriptionSKUs, t: Array<any>, options: { items: Array<{ planId: PlanId }> }): Array<SubscriptionPlans>;
    getPremiumType<Id extends PlanId>(planId: Id): SubscriptionPlanInfo[Id]["premiumType"];
    getPrice(planId: PlanId, paymentSourceId: string | null, currency: number, r: any): number;
    getSkuIdForPlan<Id extends PlanId>(planId: Id): SubscriptionPlanInfo[Id]["skuId"];
    getStatusFromInvoice(invoice: Invoice, invoicePreview: InvoicePreview): Invoice["status"];
    getUpgradeEligibilities(e: null | any): Array<any>;
    getUserMaxFileSize(user: User): number;
    hasAccountCredit(e: {
        subscriptionPlanId: PlanId,
        parentId: Snowflake,
        consumed: boolean
    }): boolean;
    isBaseSubscriptionCancelled(e: {
        status: SubscriptionStatusTypes,
        renewalMutations: { planId: PlanId }
    }): boolean;
    isNoneSubscription(subscriptionPlan: SubscriptionPlanStrings): boolean;
    isPremium(user: User, premiumType: PremiumTypes): boolean;
    isPremiumAtLeast(user: User, premiumType: PremiumTypes): boolean;
    isPremiumExactly(user: User, premiumType: PremiumTypes): boolean;
    isPremiumSku(skuSubscription: PremiumSubscriptionSKUs): boolean;
}
export default NitroUtils

/**
 * Note to self, Danho, when you read this
 * 
 * Writing these documentations was pure pain. I just want you to realize that I was suffering throughout this entire file.
 * Thank you for your understanding.
 * 
 * - Danho, 10/08/2022
 * 
 * - PS: I haven't tested half of these methods, and I'm not 100% certain that names and values in arguments are correct, so have fun with that lmao
 */