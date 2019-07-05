import { Component, ViewChild, ElementRef } from "@angular/core";
import {
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
declare var google;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "maps-angular";
  @ViewChild("map", { read: false, static: true }) mapElement: ElementRef;
  map: any;
  positionsCollection: AngularFirestoreCollection<any>;
  positionsA: any;
  positionsB: any;
  myMarker: any;
  AMarker: any;
  BMarker: any;
  constructor(private afs: AngularFirestore) {}

  ngOnInit() {
    this.loadMap();
    this.positionsCollection = this.afs.collection("positions", ref =>
      ref.orderBy("order")
    );
  }

  // Set Map
  loadMap() {
    let latLng = new google.maps.LatLng(6.236654, -75.580432);
    let mapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.loadMyPosition();
  }

  // Get My Position
  loadMyPosition() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        this.setMyLocationOnMap.bind(this),
        err => {
          console.log(
            "No se pudo obtener la location, usando location by default",
            err
          );
          this.setMyLocationOnMap({
            coords: {
              latitude: 6.208488,
              longitude: -75.563577
            }
          });
        }
      );
      this.setMyLocationOnMap({
        coords: {
          latitude: 6.208488,
          longitude: -75.563577
        }
      });
    } else {
      alert("Tu navegador no soporta geolocalización");
      this.setMyLocationOnMap({
        coords: {
          latitude: 6.208488,
          longitude: -75.563577
        }
      });
    }
  }

  setMyLocationOnMap(position) {
    if (this.myMarker) {
      this.myMarker.setMap(null);
      this.myMarker = null;
    }
    let latLng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );

    this.myMarker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.cn,
      position: latLng,
      icon: { url: "assets/photo.jpg" }
    });
  }

  pedirACalanzans() {
    // Make sure we also get the Firebase item ID!
    this.positionsA = this.positionsCollection
      .doc("PUhz5BIUIBMQNayHDWwD")
      .valueChanges();
    this.positionsA.subscribe(position => {
      if (this.AMarker) {
        this.AMarker.setMap(null);
        this.AMarker = null;
      }

      let latLng = new google.maps.LatLng(position.lat, position.long);

      this.AMarker = new google.maps.Marker({
        map: this.map,
        position: latLng,
        icon: { url: "assets/moto.png" }
      });
    });
  }
}
