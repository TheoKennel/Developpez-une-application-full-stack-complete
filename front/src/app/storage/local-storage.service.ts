import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Subscription} from "../features/articles/components/interface/subscription.interface";

/**
 * Service pour gérer le stockage local dans l'application.
 * Fournit des méthodes pour stocker, récupérer, modifier et supprimer des données dans le localStorage du navigateur.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public subscriptionsSubject: BehaviorSubject<Subscription[]> = new BehaviorSubject<Subscription[]>(this.getArray('subscriptions'));

  constructor() { }

  /**
   * Définit une valeur dans le localStorage.
   * @param key La clé sous laquelle stocker la valeur.
   * @param value La valeur à stocker.
   */
  setItem(key: string, value: string) : void {
    localStorage.setItem(key, value);
    if (key === 'subscriptions') {
      this.subscriptionsSubject.next(this.getArray('subscriptions'));
    }
  }

  /**
   * Stocke un tableau dans le localStorage.
   * @param key La clé sous laquelle stocker le tableau.
   * @param value Le tableau à stocker.
   */
  setArray(key: string, value: any[]) : void {
    localStorage.setItem(key, JSON.stringify(value));
    this.subscriptionsSubject.next(value);
  }

  /**
   * Ajoute un élément à un tableau déjà stocké et met à jour le localStorage.
   * @param key La clé du tableau.
   * @param value L'élément à ajouter.
   */
  setItemArray(key: string, value: any) : void {
    const array = this.getArray(key);
    array.push(value);
    this.setArray(key, array);
    this.subscriptionsSubject.next(array);
  }

  /**
   * Récupère une valeur du localStorage.
   * @param key La clé de la valeur à récupérer.
   * @returns La valeur stockée ou null si rien n'est trouvé.
   */
  getItem(key: string) : string | null {
    return localStorage.getItem(key);
  }

  /**
   * Récupère un tableau du localStorage.
   * @param key La clé du tableau à récupérer.
   * @returns Le tableau récupéré ou un tableau vide si rien n'est trouvé.
   */
  getArray(key: string) : any[] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }

  /**
   * Supprime un élément spécifique d'un tableau stocké dans le localStorage.
   * @param key La clé du tableau.
   * @param value L'identifiant de l'élément à supprimer.
   */
  removeItem(key : string, value : number) : void {
    const array = this.getArray(key).filter(item => item.subject.id !== value);
    this.setArray(key, array);
    this.subscriptionsSubject.next(array);
  }

  /**
   * Vide tous les éléments du localStorage.
   */
  clear(): void {
    localStorage.clear();
  }
}

