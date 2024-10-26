import { Injectable } from '@angular/core';

import { EMPTY, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Product } from './product.interface';

import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {
  createNewProduct(product: Product): Observable<Product> {
    if (!product) {
      console.error('No product provided for creation.');
      return EMPTY;
    }

    const url = `https://996a8j051f.execute-api.us-east-1.amazonaws.com/prod/products`;
    return this.http.post<Product>(url, product).pipe(
      catchError((error) => {
        console.error('Error creating new product:', error);
        return EMPTY;
      }),
    );
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
    const url = `https://996a8j051f.execute-api.us-east-1.amazonaws.com/prod/products/${productId}`;
    return this.http
      .get<{ product: Product }>(url)
      .pipe(map((resp) => resp.product || null));
  }

  getProducts(): Observable<Product[]> {
    const url =
      'https://996a8j051f.execute-api.us-east-1.amazonaws.com/prod/products';
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
