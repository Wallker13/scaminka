export const formatDate = (timestamp: number): string => {
   const date = new Date(timestamp);
   const day = `${date.getDate()}`.padStart(2, '0');
   const month = `${date.getMonth() + 1}`.padStart(2, '0');
   const year = date.getFullYear();
   return `${day}-${month}-${year}`;
}

export const subscriptionDate = (date: number, months: number) => {
   const now = new Date();
   const subscriptionEnd = new Date(date);

   const isSubscription = subscriptionEnd > now;
   const subscription = isSubscription ? subscriptionEnd : now;
   const endDate = new Date(subscription.setMonth(subscription.getMonth() + months));
   
   return { isSubscription, date: endDate.getTime()}
}

export const checkSubscription = (timestamp: number) => {
   const subscription = new Date(timestamp);
   const date = new Date();
   if(
      subscription.getDate() === date.getDate() && 
      subscription.getMonth() === date.getMonth() && 
      subscription.getFullYear() === date.getFullYear()
   ) return 'deletion'
   date.setDate(date.getDate() + 1);
   if(
      subscription.getDate() === date.getDate() && 
      subscription.getMonth() === date.getMonth() && 
      subscription.getFullYear() === date.getFullYear()
   ) return 'notification'
}

