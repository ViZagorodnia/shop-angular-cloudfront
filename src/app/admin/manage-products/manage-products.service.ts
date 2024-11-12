import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ManageProductsService extends ApiService {
  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config',
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            'Content-Type': file.type,
          },
        }),
      ),
    );
  }

  private getPreSignedUrl(fileName: string): Observable<string> {
    const url = this.getUrl('import', 'import');
    const authorizationToken = localStorage.getItem('authorization_token');
    let headers = new HttpHeaders();
    if (authorizationToken) {
      headers = headers.set('Authorization', `Basic ${authorizationToken}`);
    }

    return this.http.get<string>(url, {
      headers: headers,
      params: {
        name: fileName,
      },
    });
  }
}
