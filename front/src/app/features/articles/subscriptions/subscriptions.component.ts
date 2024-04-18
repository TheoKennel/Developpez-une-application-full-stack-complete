import {Component, Input} from '@angular/core';
import {SubscriptionApiService} from "../components/services/subscription-api.service";
import {LocalStorageService} from "../../../storage/local-storage.service";
import {HttpErrorResponse} from "@angular/common/http";

/**
 * Composant pour gérer les abonnements relatifs aux sujets.
 */
@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent {
  @Input() subjectId !: number;

  public errorMessage: string | null = null;

  constructor(private subscriptionApiService: SubscriptionApiService,
              private localStorage: LocalStorageService) {
  }

  /**
   * Vérifie si l'utilisateur actuel est abonné à un sujet donné.
   * @param subjectId L'identifiant du sujet à vérifier.
   * @returns vrai si l'utilisateur est abonné, faux sinon.
   */
  public isSubscribed(subjectId: number) {
    const subscriptions = this.localStorage.getArray("subscriptions");
    return subscriptions.some((subscription) => subscription.subject && subscription.subject.id === subjectId);
  }

  /**
   * Ajoute un abonnement pour l'utilisateur actuel au sujet spécifié.
   * @param subjectId L'identifiant du sujet auquel s'abonner.
   */
  public addSubscription(subjectId: number): void {
    const userId = this.localStorage.getItem('id');
    this.subscriptionApiService.addSubscription(userId!!, subjectId.toString()).subscribe({
      next: (subscription) => this.localStorage.setItemArray("subscriptions", subscription),
      error: (error: HttpErrorResponse) => this.errorMessage = error.message
    })
  }

  /**
   * Supprime un abonnement pour l'utilisateur actuel au sujet spécifié.
   * @param subjectId L'identifiant du sujet dont il faut se désabonner.
   */
  public removeSubscription(subjectId: number): void {
    const subscriptionId = this.localStorage.getArray("subscriptions")
      .find((subscription) => subscription.subject.id === subjectId).id;
    this.subscriptionApiService.removeSubscription(subscriptionId).subscribe({
      next: (_) => this.localStorage.removeItem("subscriptions", subjectId),
      error: (error: HttpErrorResponse) => this.errorMessage = error.message
    });
  }
}
