import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { switchMap } from 'rxjs/operators';

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
    const url = `https://0ydjp4725f.execute-api.us-east-1.amazonaws.com/prod/import`;

    return this.http.get<string>(url, {
      params: {
        fileName: fileName,
      },
    });
  }
}
