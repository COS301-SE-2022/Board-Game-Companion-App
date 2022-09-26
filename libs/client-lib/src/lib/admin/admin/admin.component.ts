import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { automataScript } from '../../shared/models/scripts/automata-script';
import { report } from '../../shared/models/scripts/report';
import { ReportService } from '../../shared/services/reports/report.service';
import { myScript } from '../../shared/models/scripts/my-script';

@Component({
  selector: 'board-game-companion-app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  tab = 0;

  ngOnInit(): void {
    this.tab = 0;
  }

}
