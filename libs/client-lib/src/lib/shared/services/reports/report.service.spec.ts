import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ReportService } from './report.service';
import { ScriptService } from '../scripts/script.service';

/************************************ Integration Tests ************************************/
describe('Test service',()=>{
  let reportService: ReportService;
  let scriptService: ScriptService;
  beforeEach(()=>{
    TestBed.configureTestingModule({imports:[HttpClientModule],providers:[ReportService,ScriptService]});
    reportService = TestBed.inject(ReportService);
    scriptService = TestBed.inject(ScriptService);
  });

  it('should create a service',()=>{
    expect(reportService).toBeTruthy();
  });

  it('GET count reported scripts',(done)=>{
    reportService.countReportedScripts().subscribe((response)=>{
      expect(response).toBeGreaterThanOrEqual(0);
      done();
    });
  });

  it('GET all reports',(done)=>{
    reportService.getAll().subscribe((response)=>{
      expect(response).resolves;
      done();
    });
  });

  it('Report a script',(done)=>{
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za')
    reportService.report(true,'63057d312899d807ab3051b9','The script has infinity loop').subscribe((response)=>{
      expect(response).toBeDefined();
      done();
    });
  });

  it('Script by Id',(done)=>{
      reportService.getByScript('63057d312899d807ab3051b9').subscribe((response)=>{
        expect(response).resolves;
        done();
      },
      (error)=>{
        expect(error.error).toStrictEqual({ statusCode: 500, message: 'Internal server error' });
        done();
      },
      ()=>{done();});
    });

  it('Is the report issued already?',(done)=>{
    window.sessionStorage.setItem('name','Njabulo Ntuli');
    window.sessionStorage.setItem('email','u19062665@tuks.co.za')
    
    reportService.alreadyIssued('63057d312899d807ab3051b9').subscribe((response)=>{
      expect(response).toBeDefined();
      done();
    });
  });

  it('Remove a report',(done)=>{
    reportService.remove('63057d312899d807ab3051b9').subscribe((response)=>{
      expect(response).toBe(null);
      done();
    });
  });

});