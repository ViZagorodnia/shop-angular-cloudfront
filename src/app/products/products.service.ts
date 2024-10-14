import { Injectable } from '@angular/core';

import { EMPTY, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Product } from './product.interface';

import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  createNewProduct(product: Product): Observable<Product> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config',
      );
      return EMPTY;
    }

    const url = this.getUrl('bff', 'products');
    return this.http.post<Product>(url, product);
  }

  editProduct(productId: string, changedProduct: Product): Observable<Product> {
    if (!this.endpointEnabled('bff')) {
      console.warn(
        'Endpoint "bff" is disabled. To enable change your environment.ts config',
      );
      return EMPTY;
    }

    const url = this.getUrl('bff', `products/${productId}`);
    return this.http.put<Product>(url, changedProduct);
  }

  getProductById(productId: string): Observable<Product | null> {
    const url = `https://xwmz206jk7.execute-api.us-east-1.amazonaws.com/prod/products/${productId}`;
    return this.http
      .get<{ product: Product }>(url)
      .pipe(map((resp) => resp.product || null));
  }

  getProducts(): Observable<Product[]> {
    const url =
      'https://xwmz206jk7.execute-api.us-east-1.amazonaws.com/prod/products';
    return this.http.get<Product[]>(url);
  }

  getProductsForCheckout(productIds: string[]): Observable<Product[]> {
    if (!productIds.length) {
      return of([]);
    }

    return this.getProducts().pipe(
      map((products) =>
        products.filter((product) => productIds.includes(product.productId)),
      ),
    );
  }
}
