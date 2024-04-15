export const getSubscriptionTerm = (duration: number) => {
    if(duration === 1) return '1 місяць';
    if(duration === 2) return '2 місяці';
    if(duration === 6) return '6 місяців';
    return '';
}