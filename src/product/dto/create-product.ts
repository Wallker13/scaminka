export class CreateProductDto {
   readonly title: string;
   readonly category: string;
   readonly price: string;
   readonly description: string;
   readonly contact: string;
   readonly link?: string;
   readonly userId: string;
}

export class CreateProviderProductDto {
   readonly title: string;
   readonly category: string;
   readonly price: string;
   readonly description: string;
   readonly contact: string;
}