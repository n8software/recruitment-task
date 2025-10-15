import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../../../../shared/models/domain/product.model';
import { ProductDto } from '../../../../shared/models/dto/product.dto';
import { ProductsApi } from '../../../../mock/products.api';

@Injectable({
  providedIn: 'root'
})
export class Products {

  constructor(private readonly _productsApi: ProductsApi) { }

  public getProducts(): Observable<Product[]> {
    return this._productsApi.fetchProducts().pipe(
      map(dtos => dtos.map(this.mapDtoToModel))
    );
  }

  private mapDtoToModel(dto: ProductDto): Product {
    const price = dto.priceInCents / 100;
    const originalPrice = dto.originalPriceInCents
      ? dto.originalPriceInCents / 100
      : undefined;

    let discountPercent: number | undefined;
    if (originalPrice && originalPrice > price) {
      const discount = ((originalPrice - price) / originalPrice) * 100;
      discountPercent = Math.round(discount);
    }

    return {
      id: dto.id,
      name: dto.productName,
      price,
      currency: dto.currencyCode,
      image: dto.imageUrl,
      owned: dto.isOwned,
      originalPrice,
      discountPercent,
    };
  }
}
