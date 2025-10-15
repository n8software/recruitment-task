import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { ProductDto } from "../shared/models/dto/product.dto";
import { MOCK_PRODUCTS } from "./data";

@Injectable({
  providedIn: 'root'
})
export class ProductsApi {
  public fetchProducts(): Observable<ProductDto[]> {
    return of(MOCK_PRODUCTS);
  }
}