import { ApplicationRef, Component, inject, signal, WritableSignal } from '@angular/core';

let READS = 0;

function counted<T>(s: WritableSignal<T>) {
  const read = () => { READS++; return s(); };
  read.set = s.set.bind(s);
  return read;
}

@Component({
  selector: 'app-root',
  template: `
    <button (click)="test()">Run test</button>
    <button (click)="time()">Run timer</button>
    <p>{{ s0() }}</p>
    <p>{{ s1() }}</p>
    <p>{{ s2() }}</p>
    <p>{{ s3() }}</p>
    <p>{{ s4() }}</p>
    <p>{{ s5() }}</p>
    <p>{{ s6() }}</p>
    <p>{{ s7() }}</p>
    <p>{{ s8() }}</p>
    <p>{{ s9() }}</p>
    <p>{{ s10() }}</p>
    <p>{{ s11() }}</p>
    <p>{{ s12() }}</p>
    <p>{{ s13() }}</p>
    <p>{{ s14() }}</p>
    <p>{{ s15() }}</p>
    <p>{{ s16() }}</p>
    <p>{{ s17() }}</p>
    <p>{{ s18() }}</p>
    <p>{{ s19() }}</p>
    <p>{{ s20() }}</p>
    <p>{{ s21() }}</p>
    <p>{{ s22() }}</p>
    <p>{{ s23() }}</p>
    <p>{{ s24() }}</p>
    <p>{{ s25() }}</p>
    <p>{{ s26() }}</p>
    <p>{{ s27() }}</p>
    <p>{{ s28() }}</p>
    <p>{{ s29() }}</p>
    <p>{{ s30() }}</p>
    <p>{{ s31() }}</p>
    <p>{{ s32() }}</p>
    <p>{{ s33() }}</p>
    <p>{{ s34() }}</p>
    <p>{{ s35() }}</p>
    <p>{{ s36() }}</p>
    <p>{{ s37() }}</p>
    <p>{{ s38() }}</p>
    <p>{{ s39() }}</p>
    <p>{{ s40() }}</p>
    <p>{{ s41() }}</p>
    <p>{{ s42() }}</p>
    <p>{{ s43() }}</p>
    <p>{{ s44() }}</p>
    <p>{{ s45() }}</p>
    <p>{{ s46() }}</p>
    <p>{{ s47() }}</p>
    <p>{{ s48() }}</p>
    <p>{{ s49() }}</p>
    <p>{{ s50() }}</p>
    <p>{{ s51() }}</p>
    <p>{{ s52() }}</p>
    <p>{{ s53() }}</p>
    <p>{{ s54() }}</p>
    <p>{{ s55() }}</p>
    <p>{{ s56() }}</p>
    <p>{{ s57() }}</p>
    <p>{{ s58() }}</p>
    <p>{{ s59() }}</p>
    <p>{{ s60() }}</p>
    <p>{{ s61() }}</p>
    <p>{{ s62() }}</p>
    <p>{{ s63() }}</p>
    <p>{{ s64() }}</p>
    <p>{{ s65() }}</p>
    <p>{{ s66() }}</p>
    <p>{{ s67() }}</p>
    <p>{{ s68() }}</p>
    <p>{{ s69() }}</p>
    <p>{{ s70() }}</p>
    <p>{{ s71() }}</p>
    <p>{{ s72() }}</p>
    <p>{{ s73() }}</p>
    <p>{{ s74() }}</p>
    <p>{{ s75() }}</p>
    <p>{{ s76() }}</p>
    <p>{{ s77() }}</p>
    <p>{{ s78() }}</p>
    <p>{{ s79() }}</p>
    <p>{{ s80() }}</p>
    <p>{{ s81() }}</p>
    <p>{{ s82() }}</p>
    <p>{{ s83() }}</p>
    <p>{{ s84() }}</p>
    <p>{{ s85() }}</p>
    <p>{{ s86() }}</p>
    <p>{{ s87() }}</p>
    <p>{{ s88() }}</p>
    <p>{{ s89() }}</p>
    <p>{{ s90() }}</p>
    <p>{{ s91() }}</p>
    <p>{{ s92() }}</p>
    <p>{{ s93() }}</p>
    <p>{{ s94() }}</p>
    <p>{{ s95() }}</p>
    <p>{{ s96() }}</p>
    <p>{{ s97() }}</p>
    <p>{{ s98() }}</p>
    <p>{{ s99() }}</p>
    <p>{{ s100() }}</p>
    <p>{{ s101() }}</p>
    <p>{{ s102() }}</p>
    <p>{{ s103() }}</p>
    <p>{{ s104() }}</p>
    <p>{{ s105() }}</p>
    <p>{{ s106() }}</p>
    <p>{{ s107() }}</p>
    <p>{{ s108() }}</p>
    <p>{{ s109() }}</p>
    <p>{{ s110() }}</p>
    <p>{{ s111() }}</p>
    <p>{{ s112() }}</p>
    <p>{{ s113() }}</p>
    <p>{{ s114() }}</p>
    <p>{{ s115() }}</p>
    <p>{{ s116() }}</p>
    <p>{{ s117() }}</p>
    <p>{{ s118() }}</p>
    <p>{{ s119() }}</p>
    <p>{{ s120() }}</p>
    <p>{{ s121() }}</p>
    <p>{{ s122() }}</p>
    <p>{{ s123() }}</p>
    <p>{{ s124() }}</p>
    <p>{{ s125() }}</p>
    <p>{{ s126() }}</p>
    <p>{{ s127() }}</p>
    <p>{{ s128() }}</p>
    <p>{{ s129() }}</p>
    <p>{{ s130() }}</p>
    <p>{{ s131() }}</p>
    <p>{{ s132() }}</p>
    <p>{{ s133() }}</p>
    <p>{{ s134() }}</p>
    <p>{{ s135() }}</p>
    <p>{{ s136() }}</p>
    <p>{{ s137() }}</p>
    <p>{{ s138() }}</p>
    <p>{{ s139() }}</p>
    <p>{{ s140() }}</p>
    <p>{{ s141() }}</p>
    <p>{{ s142() }}</p>
    <p>{{ s143() }}</p>
    <p>{{ s144() }}</p>
    <p>{{ s145() }}</p>
    <p>{{ s146() }}</p>
    <p>{{ s147() }}</p>
    <p>{{ s148() }}</p>
    <p>{{ s149() }}</p>
    <p>{{ s150() }}</p>
    <p>{{ s151() }}</p>
    <p>{{ s152() }}</p>
    <p>{{ s153() }}</p>
    <p>{{ s154() }}</p>
    <p>{{ s155() }}</p>
    <p>{{ s156() }}</p>
    <p>{{ s157() }}</p>
    <p>{{ s158() }}</p>
    <p>{{ s159() }}</p>
    <p>{{ s160() }}</p>
    <p>{{ s161() }}</p>
    <p>{{ s162() }}</p>
    <p>{{ s163() }}</p>
    <p>{{ s164() }}</p>
    <p>{{ s165() }}</p>
    <p>{{ s166() }}</p>
    <p>{{ s167() }}</p>
    <p>{{ s168() }}</p>
    <p>{{ s169() }}</p>
    <p>{{ s170() }}</p>
    <p>{{ s171() }}</p>
    <p>{{ s172() }}</p>
    <p>{{ s173() }}</p>
    <p>{{ s174() }}</p>
    <p>{{ s175() }}</p>
    <p>{{ s176() }}</p>
    <p>{{ s177() }}</p>
    <p>{{ s178() }}</p>
    <p>{{ s179() }}</p>
    <p>{{ s180() }}</p>
    <p>{{ s181() }}</p>
    <p>{{ s182() }}</p>
    <p>{{ s183() }}</p>
    <p>{{ s184() }}</p>
    <p>{{ s185() }}</p>
    <p>{{ s186() }}</p>
    <p>{{ s187() }}</p>
    <p>{{ s188() }}</p>
    <p>{{ s189() }}</p>
    <p>{{ s190() }}</p>
    <p>{{ s191() }}</p>
    <p>{{ s192() }}</p>
    <p>{{ s193() }}</p>
    <p>{{ s194() }}</p>
    <p>{{ s195() }}</p>
    <p>{{ s196() }}</p>
    <p>{{ s197() }}</p>
    <p>{{ s198() }}</p>
    <p>{{ s199() }}</p>
    <p>{{ s200() }}</p>
    <p>{{ s201() }}</p>
    <p>{{ s202() }}</p>
    <p>{{ s203() }}</p>
    <p>{{ s204() }}</p>
    <p>{{ s205() }}</p>
    <p>{{ s206() }}</p>
    <p>{{ s207() }}</p>
    <p>{{ s208() }}</p>
    <p>{{ s209() }}</p>
    <p>{{ s210() }}</p>
    <p>{{ s211() }}</p>
    <p>{{ s212() }}</p>
    <p>{{ s213() }}</p>
    <p>{{ s214() }}</p>
    <p>{{ s215() }}</p>
    <p>{{ s216() }}</p>
    <p>{{ s217() }}</p>
    <p>{{ s218() }}</p>
    <p>{{ s219() }}</p>
    <p>{{ s220() }}</p>
    <p>{{ s221() }}</p>
    <p>{{ s222() }}</p>
    <p>{{ s223() }}</p>
    <p>{{ s224() }}</p>
    <p>{{ s225() }}</p>
    <p>{{ s226() }}</p>
    <p>{{ s227() }}</p>
    <p>{{ s228() }}</p>
    <p>{{ s229() }}</p>
    <p>{{ s230() }}</p>
    <p>{{ s231() }}</p>
    <p>{{ s232() }}</p>
    <p>{{ s233() }}</p>
    <p>{{ s234() }}</p>
    <p>{{ s235() }}</p>
    <p>{{ s236() }}</p>
    <p>{{ s237() }}</p>
    <p>{{ s238() }}</p>
    <p>{{ s239() }}</p>
    <p>{{ s240() }}</p>
    <p>{{ s241() }}</p>
    <p>{{ s242() }}</p>
    <p>{{ s243() }}</p>
    <p>{{ s244() }}</p>
    <p>{{ s245() }}</p>
    <p>{{ s246() }}</p>
    <p>{{ s247() }}</p>
    <p>{{ s248() }}</p>
    <p>{{ s249() }}</p>
    <p>{{ s250() }}</p>
    <p>{{ s251() }}</p>
    <p>{{ s252() }}</p>
    <p>{{ s253() }}</p>
    <p>{{ s254() }}</p>
    <p>{{ s255() }}</p>
    <p>{{ s256() }}</p>
    <p>{{ s257() }}</p>
    <p>{{ s258() }}</p>
    <p>{{ s259() }}</p>
    <p>{{ s260() }}</p>
    <p>{{ s261() }}</p>
    <p>{{ s262() }}</p>
    <p>{{ s263() }}</p>
    <p>{{ s264() }}</p>
    <p>{{ s265() }}</p>
    <p>{{ s266() }}</p>
    <p>{{ s267() }}</p>
    <p>{{ s268() }}</p>
    <p>{{ s269() }}</p>
    <p>{{ s270() }}</p>
    <p>{{ s271() }}</p>
    <p>{{ s272() }}</p>
    <p>{{ s273() }}</p>
    <p>{{ s274() }}</p>
    <p>{{ s275() }}</p>
    <p>{{ s276() }}</p>
    <p>{{ s277() }}</p>
    <p>{{ s278() }}</p>
    <p>{{ s279() }}</p>
    <p>{{ s280() }}</p>
    <p>{{ s281() }}</p>
    <p>{{ s282() }}</p>
    <p>{{ s283() }}</p>
    <p>{{ s284() }}</p>
    <p>{{ s285() }}</p>
    <p>{{ s286() }}</p>
    <p>{{ s287() }}</p>
    <p>{{ s288() }}</p>
    <p>{{ s289() }}</p>
    <p>{{ s290() }}</p>
    <p>{{ s291() }}</p>
    <p>{{ s292() }}</p>
    <p>{{ s293() }}</p>
    <p>{{ s294() }}</p>
    <p>{{ s295() }}</p>
    <p>{{ s296() }}</p>
    <p>{{ s297() }}</p>
    <p>{{ s298() }}</p>
    <p>{{ s299() }}</p>
    <p>{{ s300() }}</p>
    <p>{{ s301() }}</p>
    <p>{{ s302() }}</p>
    <p>{{ s303() }}</p>
    <p>{{ s304() }}</p>
    <p>{{ s305() }}</p>
    <p>{{ s306() }}</p>
    <p>{{ s307() }}</p>
    <p>{{ s308() }}</p>
    <p>{{ s309() }}</p>
    <p>{{ s310() }}</p>
    <p>{{ s311() }}</p>
    <p>{{ s312() }}</p>
    <p>{{ s313() }}</p>
    <p>{{ s314() }}</p>
    <p>{{ s315() }}</p>
    <p>{{ s316() }}</p>
    <p>{{ s317() }}</p>
    <p>{{ s318() }}</p>
    <p>{{ s319() }}</p>
    <p>{{ s320() }}</p>
    <p>{{ s321() }}</p>
    <p>{{ s322() }}</p>
    <p>{{ s323() }}</p>
    <p>{{ s324() }}</p>
    <p>{{ s325() }}</p>
    <p>{{ s326() }}</p>
    <p>{{ s327() }}</p>
    <p>{{ s328() }}</p>
    <p>{{ s329() }}</p>
    <p>{{ s330() }}</p>
    <p>{{ s331() }}</p>
    <p>{{ s332() }}</p>
    <p>{{ s333() }}</p>
    <p>{{ s334() }}</p>
    <p>{{ s335() }}</p>
    <p>{{ s336() }}</p>
    <p>{{ s337() }}</p>
    <p>{{ s338() }}</p>
    <p>{{ s339() }}</p>
    <p>{{ s340() }}</p>
    <p>{{ s341() }}</p>
    <p>{{ s342() }}</p>
    <p>{{ s343() }}</p>
    <p>{{ s344() }}</p>
    <p>{{ s345() }}</p>
    <p>{{ s346() }}</p>
    <p>{{ s347() }}</p>
    <p>{{ s348() }}</p>
    <p>{{ s349() }}</p>
    <p>{{ s350() }}</p>
    <p>{{ s351() }}</p>
    <p>{{ s352() }}</p>
    <p>{{ s353() }}</p>
    <p>{{ s354() }}</p>
    <p>{{ s355() }}</p>
    <p>{{ s356() }}</p>
    <p>{{ s357() }}</p>
    <p>{{ s358() }}</p>
    <p>{{ s359() }}</p>
    <p>{{ s360() }}</p>
    <p>{{ s361() }}</p>
    <p>{{ s362() }}</p>
    <p>{{ s363() }}</p>
    <p>{{ s364() }}</p>
    <p>{{ s365() }}</p>
    <p>{{ s366() }}</p>
    <p>{{ s367() }}</p>
    <p>{{ s368() }}</p>
    <p>{{ s369() }}</p>
    <p>{{ s370() }}</p>
    <p>{{ s371() }}</p>
    <p>{{ s372() }}</p>
    <p>{{ s373() }}</p>
    <p>{{ s374() }}</p>
    <p>{{ s375() }}</p>
    <p>{{ s376() }}</p>
    <p>{{ s377() }}</p>
    <p>{{ s378() }}</p>
    <p>{{ s379() }}</p>
    <p>{{ s380() }}</p>
    <p>{{ s381() }}</p>
    <p>{{ s382() }}</p>
    <p>{{ s383() }}</p>
    <p>{{ s384() }}</p>
    <p>{{ s385() }}</p>
    <p>{{ s386() }}</p>
    <p>{{ s387() }}</p>
    <p>{{ s388() }}</p>
    <p>{{ s389() }}</p>
    <p>{{ s390() }}</p>
    <p>{{ s391() }}</p>
    <p>{{ s392() }}</p>
    <p>{{ s393() }}</p>
    <p>{{ s394() }}</p>
    <p>{{ s395() }}</p>
    <p>{{ s396() }}</p>
    <p>{{ s397() }}</p>
    <p>{{ s398() }}</p>
    <p>{{ s399() }}</p>
    <p>{{ s400() }}</p>
    <p>{{ s401() }}</p>
    <p>{{ s402() }}</p>
    <p>{{ s403() }}</p>
    <p>{{ s404() }}</p>
    <p>{{ s405() }}</p>
    <p>{{ s406() }}</p>
    <p>{{ s407() }}</p>
    <p>{{ s408() }}</p>
    <p>{{ s409() }}</p>
    <p>{{ s410() }}</p>
    <p>{{ s411() }}</p>
    <p>{{ s412() }}</p>
    <p>{{ s413() }}</p>
    <p>{{ s414() }}</p>
    <p>{{ s415() }}</p>
    <p>{{ s416() }}</p>
    <p>{{ s417() }}</p>
    <p>{{ s418() }}</p>
    <p>{{ s419() }}</p>
    <p>{{ s420() }}</p>
    <p>{{ s421() }}</p>
    <p>{{ s422() }}</p>
    <p>{{ s423() }}</p>
    <p>{{ s424() }}</p>
    <p>{{ s425() }}</p>
    <p>{{ s426() }}</p>
    <p>{{ s427() }}</p>
    <p>{{ s428() }}</p>
    <p>{{ s429() }}</p>
    <p>{{ s430() }}</p>
    <p>{{ s431() }}</p>
    <p>{{ s432() }}</p>
    <p>{{ s433() }}</p>
    <p>{{ s434() }}</p>
    <p>{{ s435() }}</p>
    <p>{{ s436() }}</p>
    <p>{{ s437() }}</p>
    <p>{{ s438() }}</p>
    <p>{{ s439() }}</p>
    <p>{{ s440() }}</p>
    <p>{{ s441() }}</p>
    <p>{{ s442() }}</p>
    <p>{{ s443() }}</p>
    <p>{{ s444() }}</p>
    <p>{{ s445() }}</p>
    <p>{{ s446() }}</p>
    <p>{{ s447() }}</p>
    <p>{{ s448() }}</p>
    <p>{{ s449() }}</p>
    <p>{{ s450() }}</p>
    <p>{{ s451() }}</p>
    <p>{{ s452() }}</p>
    <p>{{ s453() }}</p>
    <p>{{ s454() }}</p>
    <p>{{ s455() }}</p>
    <p>{{ s456() }}</p>
    <p>{{ s457() }}</p>
    <p>{{ s458() }}</p>
    <p>{{ s459() }}</p>
    <p>{{ s460() }}</p>
    <p>{{ s461() }}</p>
    <p>{{ s462() }}</p>
    <p>{{ s463() }}</p>
    <p>{{ s464() }}</p>
    <p>{{ s465() }}</p>
    <p>{{ s466() }}</p>
    <p>{{ s467() }}</p>
    <p>{{ s468() }}</p>
    <p>{{ s469() }}</p>
    <p>{{ s470() }}</p>
    <p>{{ s471() }}</p>
    <p>{{ s472() }}</p>
    <p>{{ s473() }}</p>
    <p>{{ s474() }}</p>
    <p>{{ s475() }}</p>
    <p>{{ s476() }}</p>
    <p>{{ s477() }}</p>
    <p>{{ s478() }}</p>
    <p>{{ s479() }}</p>
    <p>{{ s480() }}</p>
    <p>{{ s481() }}</p>
    <p>{{ s482() }}</p>
    <p>{{ s483() }}</p>
    <p>{{ s484() }}</p>
    <p>{{ s485() }}</p>
    <p>{{ s486() }}</p>
    <p>{{ s487() }}</p>
    <p>{{ s488() }}</p>
    <p>{{ s489() }}</p>
    <p>{{ s490() }}</p>
    <p>{{ s491() }}</p>
    <p>{{ s492() }}</p>
    <p>{{ s493() }}</p>
    <p>{{ s494() }}</p>
    <p>{{ s495() }}</p>
    <p>{{ s496() }}</p>
    <p>{{ s497() }}</p>
    <p>{{ s498() }}</p>
    <p>{{ s499() }}</p>
    <p>{{ s500() }}</p>
    <p>{{ s501() }}</p>
    <p>{{ s502() }}</p>
    <p>{{ s503() }}</p>
    <p>{{ s504() }}</p>
    <p>{{ s505() }}</p>
    <p>{{ s506() }}</p>
    <p>{{ s507() }}</p>
    <p>{{ s508() }}</p>
    <p>{{ s509() }}</p>
    <p>{{ s510() }}</p>
    <p>{{ s511() }}</p>
    <p>{{ s512() }}</p>
    <p>{{ s513() }}</p>
    <p>{{ s514() }}</p>
    <p>{{ s515() }}</p>
    <p>{{ s516() }}</p>
    <p>{{ s517() }}</p>
    <p>{{ s518() }}</p>
    <p>{{ s519() }}</p>
    <p>{{ s520() }}</p>
    <p>{{ s521() }}</p>
    <p>{{ s522() }}</p>
    <p>{{ s523() }}</p>
    <p>{{ s524() }}</p>
    <p>{{ s525() }}</p>
    <p>{{ s526() }}</p>
    <p>{{ s527() }}</p>
    <p>{{ s528() }}</p>
    <p>{{ s529() }}</p>
    <p>{{ s530() }}</p>
    <p>{{ s531() }}</p>
    <p>{{ s532() }}</p>
    <p>{{ s533() }}</p>
    <p>{{ s534() }}</p>
    <p>{{ s535() }}</p>
    <p>{{ s536() }}</p>
    <p>{{ s537() }}</p>
    <p>{{ s538() }}</p>
    <p>{{ s539() }}</p>
    <p>{{ s540() }}</p>
    <p>{{ s541() }}</p>
    <p>{{ s542() }}</p>
    <p>{{ s543() }}</p>
    <p>{{ s544() }}</p>
    <p>{{ s545() }}</p>
    <p>{{ s546() }}</p>
    <p>{{ s547() }}</p>
    <p>{{ s548() }}</p>
    <p>{{ s549() }}</p>
    <p>{{ s550() }}</p>
    <p>{{ s551() }}</p>
    <p>{{ s552() }}</p>
    <p>{{ s553() }}</p>
    <p>{{ s554() }}</p>
    <p>{{ s555() }}</p>
    <p>{{ s556() }}</p>
    <p>{{ s557() }}</p>
    <p>{{ s558() }}</p>
    <p>{{ s559() }}</p>
    <p>{{ s560() }}</p>
    <p>{{ s561() }}</p>
    <p>{{ s562() }}</p>
    <p>{{ s563() }}</p>
    <p>{{ s564() }}</p>
    <p>{{ s565() }}</p>
    <p>{{ s566() }}</p>
    <p>{{ s567() }}</p>
    <p>{{ s568() }}</p>
    <p>{{ s569() }}</p>
    <p>{{ s570() }}</p>
    <p>{{ s571() }}</p>
    <p>{{ s572() }}</p>
    <p>{{ s573() }}</p>
    <p>{{ s574() }}</p>
    <p>{{ s575() }}</p>
    <p>{{ s576() }}</p>
    <p>{{ s577() }}</p>
    <p>{{ s578() }}</p>
    <p>{{ s579() }}</p>
    <p>{{ s580() }}</p>
    <p>{{ s581() }}</p>
    <p>{{ s582() }}</p>
    <p>{{ s583() }}</p>
    <p>{{ s584() }}</p>
    <p>{{ s585() }}</p>
    <p>{{ s586() }}</p>
    <p>{{ s587() }}</p>
    <p>{{ s588() }}</p>
    <p>{{ s589() }}</p>
    <p>{{ s590() }}</p>
    <p>{{ s591() }}</p>
    <p>{{ s592() }}</p>
    <p>{{ s593() }}</p>
    <p>{{ s594() }}</p>
    <p>{{ s595() }}</p>
    <p>{{ s596() }}</p>
    <p>{{ s597() }}</p>
    <p>{{ s598() }}</p>
    <p>{{ s599() }}</p>
    <p>{{ s600() }}</p>
    <p>{{ s601() }}</p>
    <p>{{ s602() }}</p>
    <p>{{ s603() }}</p>
    <p>{{ s604() }}</p>
    <p>{{ s605() }}</p>
    <p>{{ s606() }}</p>
    <p>{{ s607() }}</p>
    <p>{{ s608() }}</p>
    <p>{{ s609() }}</p>
    <p>{{ s610() }}</p>
    <p>{{ s611() }}</p>
    <p>{{ s612() }}</p>
    <p>{{ s613() }}</p>
    <p>{{ s614() }}</p>
    <p>{{ s615() }}</p>
    <p>{{ s616() }}</p>
    <p>{{ s617() }}</p>
    <p>{{ s618() }}</p>
    <p>{{ s619() }}</p>
    <p>{{ s620() }}</p>
    <p>{{ s621() }}</p>
    <p>{{ s622() }}</p>
    <p>{{ s623() }}</p>
    <p>{{ s624() }}</p>
    <p>{{ s625() }}</p>
    <p>{{ s626() }}</p>
    <p>{{ s627() }}</p>
    <p>{{ s628() }}</p>
    <p>{{ s629() }}</p>
    <p>{{ s630() }}</p>
    <p>{{ s631() }}</p>
    <p>{{ s632() }}</p>
    <p>{{ s633() }}</p>
    <p>{{ s634() }}</p>
    <p>{{ s635() }}</p>
    <p>{{ s636() }}</p>
    <p>{{ s637() }}</p>
    <p>{{ s638() }}</p>
    <p>{{ s639() }}</p>
    <p>{{ s640() }}</p>
    <p>{{ s641() }}</p>
    <p>{{ s642() }}</p>
    <p>{{ s643() }}</p>
    <p>{{ s644() }}</p>
    <p>{{ s645() }}</p>
    <p>{{ s646() }}</p>
    <p>{{ s647() }}</p>
    <p>{{ s648() }}</p>
    <p>{{ s649() }}</p>
    <p>{{ s650() }}</p>
    <p>{{ s651() }}</p>
    <p>{{ s652() }}</p>
    <p>{{ s653() }}</p>
    <p>{{ s654() }}</p>
    <p>{{ s655() }}</p>
    <p>{{ s656() }}</p>
    <p>{{ s657() }}</p>
    <p>{{ s658() }}</p>
    <p>{{ s659() }}</p>
    <p>{{ s660() }}</p>
    <p>{{ s661() }}</p>
    <p>{{ s662() }}</p>
    <p>{{ s663() }}</p>
    <p>{{ s664() }}</p>
    <p>{{ s665() }}</p>
    <p>{{ s666() }}</p>
    <p>{{ s667() }}</p>
    <p>{{ s668() }}</p>
    <p>{{ s669() }}</p>
    <p>{{ s670() }}</p>
    <p>{{ s671() }}</p>
    <p>{{ s672() }}</p>
    <p>{{ s673() }}</p>
    <p>{{ s674() }}</p>
    <p>{{ s675() }}</p>
    <p>{{ s676() }}</p>
    <p>{{ s677() }}</p>
    <p>{{ s678() }}</p>
    <p>{{ s679() }}</p>
    <p>{{ s680() }}</p>
    <p>{{ s681() }}</p>
    <p>{{ s682() }}</p>
    <p>{{ s683() }}</p>
    <p>{{ s684() }}</p>
    <p>{{ s685() }}</p>
    <p>{{ s686() }}</p>
    <p>{{ s687() }}</p>
    <p>{{ s688() }}</p>
    <p>{{ s689() }}</p>
    <p>{{ s690() }}</p>
    <p>{{ s691() }}</p>
    <p>{{ s692() }}</p>
    <p>{{ s693() }}</p>
    <p>{{ s694() }}</p>
    <p>{{ s695() }}</p>
    <p>{{ s696() }}</p>
    <p>{{ s697() }}</p>
    <p>{{ s698() }}</p>
    <p>{{ s699() }}</p>
    <p>{{ s700() }}</p>
    <p>{{ s701() }}</p>
    <p>{{ s702() }}</p>
    <p>{{ s703() }}</p>
    <p>{{ s704() }}</p>
    <p>{{ s705() }}</p>
    <p>{{ s706() }}</p>
    <p>{{ s707() }}</p>
    <p>{{ s708() }}</p>
    <p>{{ s709() }}</p>
    <p>{{ s710() }}</p>
    <p>{{ s711() }}</p>
    <p>{{ s712() }}</p>
    <p>{{ s713() }}</p>
    <p>{{ s714() }}</p>
    <p>{{ s715() }}</p>
    <p>{{ s716() }}</p>
    <p>{{ s717() }}</p>
    <p>{{ s718() }}</p>
    <p>{{ s719() }}</p>
    <p>{{ s720() }}</p>
    <p>{{ s721() }}</p>
    <p>{{ s722() }}</p>
    <p>{{ s723() }}</p>
    <p>{{ s724() }}</p>
    <p>{{ s725() }}</p>
    <p>{{ s726() }}</p>
    <p>{{ s727() }}</p>
    <p>{{ s728() }}</p>
    <p>{{ s729() }}</p>
    <p>{{ s730() }}</p>
    <p>{{ s731() }}</p>
    <p>{{ s732() }}</p>
    <p>{{ s733() }}</p>
    <p>{{ s734() }}</p>
    <p>{{ s735() }}</p>
    <p>{{ s736() }}</p>
    <p>{{ s737() }}</p>
    <p>{{ s738() }}</p>
    <p>{{ s739() }}</p>
    <p>{{ s740() }}</p>
    <p>{{ s741() }}</p>
    <p>{{ s742() }}</p>
    <p>{{ s743() }}</p>
    <p>{{ s744() }}</p>
    <p>{{ s745() }}</p>
    <p>{{ s746() }}</p>
    <p>{{ s747() }}</p>
    <p>{{ s748() }}</p>
    <p>{{ s749() }}</p>
    <p>{{ s750() }}</p>
    <p>{{ s751() }}</p>
    <p>{{ s752() }}</p>
    <p>{{ s753() }}</p>
    <p>{{ s754() }}</p>
    <p>{{ s755() }}</p>
    <p>{{ s756() }}</p>
    <p>{{ s757() }}</p>
    <p>{{ s758() }}</p>
    <p>{{ s759() }}</p>
    <p>{{ s760() }}</p>
    <p>{{ s761() }}</p>
    <p>{{ s762() }}</p>
    <p>{{ s763() }}</p>
    <p>{{ s764() }}</p>
    <p>{{ s765() }}</p>
    <p>{{ s766() }}</p>
    <p>{{ s767() }}</p>
    <p>{{ s768() }}</p>
    <p>{{ s769() }}</p>
    <p>{{ s770() }}</p>
    <p>{{ s771() }}</p>
    <p>{{ s772() }}</p>
    <p>{{ s773() }}</p>
    <p>{{ s774() }}</p>
    <p>{{ s775() }}</p>
    <p>{{ s776() }}</p>
    <p>{{ s777() }}</p>
    <p>{{ s778() }}</p>
    <p>{{ s779() }}</p>
    <p>{{ s780() }}</p>
    <p>{{ s781() }}</p>
    <p>{{ s782() }}</p>
    <p>{{ s783() }}</p>
    <p>{{ s784() }}</p>
    <p>{{ s785() }}</p>
    <p>{{ s786() }}</p>
    <p>{{ s787() }}</p>
    <p>{{ s788() }}</p>
    <p>{{ s789() }}</p>
    <p>{{ s790() }}</p>
    <p>{{ s791() }}</p>
    <p>{{ s792() }}</p>
    <p>{{ s793() }}</p>
    <p>{{ s794() }}</p>
    <p>{{ s795() }}</p>
    <p>{{ s796() }}</p>
    <p>{{ s797() }}</p>
    <p>{{ s798() }}</p>
    <p>{{ s799() }}</p>
    <p>{{ s800() }}</p>
    <p>{{ s801() }}</p>
    <p>{{ s802() }}</p>
    <p>{{ s803() }}</p>
    <p>{{ s804() }}</p>
    <p>{{ s805() }}</p>
    <p>{{ s806() }}</p>
    <p>{{ s807() }}</p>
    <p>{{ s808() }}</p>
    <p>{{ s809() }}</p>
    <p>{{ s810() }}</p>
    <p>{{ s811() }}</p>
    <p>{{ s812() }}</p>
    <p>{{ s813() }}</p>
    <p>{{ s814() }}</p>
    <p>{{ s815() }}</p>
    <p>{{ s816() }}</p>
    <p>{{ s817() }}</p>
    <p>{{ s818() }}</p>
    <p>{{ s819() }}</p>
    <p>{{ s820() }}</p>
    <p>{{ s821() }}</p>
    <p>{{ s822() }}</p>
    <p>{{ s823() }}</p>
    <p>{{ s824() }}</p>
    <p>{{ s825() }}</p>
    <p>{{ s826() }}</p>
    <p>{{ s827() }}</p>
    <p>{{ s828() }}</p>
    <p>{{ s829() }}</p>
    <p>{{ s830() }}</p>
    <p>{{ s831() }}</p>
    <p>{{ s832() }}</p>
    <p>{{ s833() }}</p>
    <p>{{ s834() }}</p>
    <p>{{ s835() }}</p>
    <p>{{ s836() }}</p>
    <p>{{ s837() }}</p>
    <p>{{ s838() }}</p>
    <p>{{ s839() }}</p>
    <p>{{ s840() }}</p>
    <p>{{ s841() }}</p>
    <p>{{ s842() }}</p>
    <p>{{ s843() }}</p>
    <p>{{ s844() }}</p>
    <p>{{ s845() }}</p>
    <p>{{ s846() }}</p>
    <p>{{ s847() }}</p>
    <p>{{ s848() }}</p>
    <p>{{ s849() }}</p>
    <p>{{ s850() }}</p>
    <p>{{ s851() }}</p>
    <p>{{ s852() }}</p>
    <p>{{ s853() }}</p>
    <p>{{ s854() }}</p>
    <p>{{ s855() }}</p>
    <p>{{ s856() }}</p>
    <p>{{ s857() }}</p>
    <p>{{ s858() }}</p>
    <p>{{ s859() }}</p>
    <p>{{ s860() }}</p>
    <p>{{ s861() }}</p>
    <p>{{ s862() }}</p>
    <p>{{ s863() }}</p>
    <p>{{ s864() }}</p>
    <p>{{ s865() }}</p>
    <p>{{ s866() }}</p>
    <p>{{ s867() }}</p>
    <p>{{ s868() }}</p>
    <p>{{ s869() }}</p>
    <p>{{ s870() }}</p>
    <p>{{ s871() }}</p>
    <p>{{ s872() }}</p>
    <p>{{ s873() }}</p>
    <p>{{ s874() }}</p>
    <p>{{ s875() }}</p>
    <p>{{ s876() }}</p>
    <p>{{ s877() }}</p>
    <p>{{ s878() }}</p>
    <p>{{ s879() }}</p>
    <p>{{ s880() }}</p>
    <p>{{ s881() }}</p>
    <p>{{ s882() }}</p>
    <p>{{ s883() }}</p>
    <p>{{ s884() }}</p>
    <p>{{ s885() }}</p>
    <p>{{ s886() }}</p>
    <p>{{ s887() }}</p>
    <p>{{ s888() }}</p>
    <p>{{ s889() }}</p>
    <p>{{ s890() }}</p>
    <p>{{ s891() }}</p>
    <p>{{ s892() }}</p>
    <p>{{ s893() }}</p>
    <p>{{ s894() }}</p>
    <p>{{ s895() }}</p>
    <p>{{ s896() }}</p>
    <p>{{ s897() }}</p>
    <p>{{ s898() }}</p>
    <p>{{ s899() }}</p>
    <p>{{ s900() }}</p>
    <p>{{ s901() }}</p>
    <p>{{ s902() }}</p>
    <p>{{ s903() }}</p>
    <p>{{ s904() }}</p>
    <p>{{ s905() }}</p>
    <p>{{ s906() }}</p>
    <p>{{ s907() }}</p>
    <p>{{ s908() }}</p>
    <p>{{ s909() }}</p>
    <p>{{ s910() }}</p>
    <p>{{ s911() }}</p>
    <p>{{ s912() }}</p>
    <p>{{ s913() }}</p>
    <p>{{ s914() }}</p>
    <p>{{ s915() }}</p>
    <p>{{ s916() }}</p>
    <p>{{ s917() }}</p>
    <p>{{ s918() }}</p>
    <p>{{ s919() }}</p>
    <p>{{ s920() }}</p>
    <p>{{ s921() }}</p>
    <p>{{ s922() }}</p>
    <p>{{ s923() }}</p>
    <p>{{ s924() }}</p>
    <p>{{ s925() }}</p>
    <p>{{ s926() }}</p>
    <p>{{ s927() }}</p>
    <p>{{ s928() }}</p>
    <p>{{ s929() }}</p>
    <p>{{ s930() }}</p>
    <p>{{ s931() }}</p>
    <p>{{ s932() }}</p>
    <p>{{ s933() }}</p>
    <p>{{ s934() }}</p>
    <p>{{ s935() }}</p>
    <p>{{ s936() }}</p>
    <p>{{ s937() }}</p>
    <p>{{ s938() }}</p>
    <p>{{ s939() }}</p>
    <p>{{ s940() }}</p>
    <p>{{ s941() }}</p>
    <p>{{ s942() }}</p>
    <p>{{ s943() }}</p>
    <p>{{ s944() }}</p>
    <p>{{ s945() }}</p>
    <p>{{ s946() }}</p>
    <p>{{ s947() }}</p>
    <p>{{ s948() }}</p>
    <p>{{ s949() }}</p>
    <p>{{ s950() }}</p>
    <p>{{ s951() }}</p>
    <p>{{ s952() }}</p>
    <p>{{ s953() }}</p>
    <p>{{ s954() }}</p>
    <p>{{ s955() }}</p>
    <p>{{ s956() }}</p>
    <p>{{ s957() }}</p>
    <p>{{ s958() }}</p>
    <p>{{ s959() }}</p>
    <p>{{ s960() }}</p>
    <p>{{ s961() }}</p>
    <p>{{ s962() }}</p>
    <p>{{ s963() }}</p>
    <p>{{ s964() }}</p>
    <p>{{ s965() }}</p>
    <p>{{ s966() }}</p>
    <p>{{ s967() }}</p>
    <p>{{ s968() }}</p>
    <p>{{ s969() }}</p>
    <p>{{ s970() }}</p>
    <p>{{ s971() }}</p>
    <p>{{ s972() }}</p>
    <p>{{ s973() }}</p>
    <p>{{ s974() }}</p>
    <p>{{ s975() }}</p>
    <p>{{ s976() }}</p>
    <p>{{ s977() }}</p>
    <p>{{ s978() }}</p>
    <p>{{ s979() }}</p>
    <p>{{ s980() }}</p>
    <p>{{ s981() }}</p>
    <p>{{ s982() }}</p>
    <p>{{ s983() }}</p>
    <p>{{ s984() }}</p>
    <p>{{ s985() }}</p>
    <p>{{ s986() }}</p>
    <p>{{ s987() }}</p>
    <p>{{ s988() }}</p>
    <p>{{ s989() }}</p>
    <p>{{ s990() }}</p>
    <p>{{ s991() }}</p>
    <p>{{ s992() }}</p>
    <p>{{ s993() }}</p>
    <p>{{ s994() }}</p>
    <p>{{ s995() }}</p>
    <p>{{ s996() }}</p>
    <p>{{ s997() }}</p>
    <p>{{ s998() }}</p>
    <p>{{ s999() }}</p>
  `,
})
export class App {
  private appRef = inject(ApplicationRef);
  readonly s0 = counted(signal(0));
  readonly s1 = counted(signal(1));
  readonly s2 = counted(signal(2));
  readonly s3 = counted(signal(3));
  readonly s4 = counted(signal(4));
  readonly s5 = counted(signal(5));
  readonly s6 = counted(signal(6));
  readonly s7 = counted(signal(7));
  readonly s8 = counted(signal(8));
  readonly s9 = counted(signal(9));
  readonly s10 = counted(signal(10));
  readonly s11 = counted(signal(11));
  readonly s12 = counted(signal(12));
  readonly s13 = counted(signal(13));
  readonly s14 = counted(signal(14));
  readonly s15 = counted(signal(15));
  readonly s16 = counted(signal(16));
  readonly s17 = counted(signal(17));
  readonly s18 = counted(signal(18));
  readonly s19 = counted(signal(19));
  readonly s20 = counted(signal(20));
  readonly s21 = counted(signal(21));
  readonly s22 = counted(signal(22));
  readonly s23 = counted(signal(23));
  readonly s24 = counted(signal(24));
  readonly s25 = counted(signal(25));
  readonly s26 = counted(signal(26));
  readonly s27 = counted(signal(27));
  readonly s28 = counted(signal(28));
  readonly s29 = counted(signal(29));
  readonly s30 = counted(signal(30));
  readonly s31 = counted(signal(31));
  readonly s32 = counted(signal(32));
  readonly s33 = counted(signal(33));
  readonly s34 = counted(signal(34));
  readonly s35 = counted(signal(35));
  readonly s36 = counted(signal(36));
  readonly s37 = counted(signal(37));
  readonly s38 = counted(signal(38));
  readonly s39 = counted(signal(39));
  readonly s40 = counted(signal(40));
  readonly s41 = counted(signal(41));
  readonly s42 = counted(signal(42));
  readonly s43 = counted(signal(43));
  readonly s44 = counted(signal(44));
  readonly s45 = counted(signal(45));
  readonly s46 = counted(signal(46));
  readonly s47 = counted(signal(47));
  readonly s48 = counted(signal(48));
  readonly s49 = counted(signal(49));
  readonly s50 = counted(signal(50));
  readonly s51 = counted(signal(51));
  readonly s52 = counted(signal(52));
  readonly s53 = counted(signal(53));
  readonly s54 = counted(signal(54));
  readonly s55 = counted(signal(55));
  readonly s56 = counted(signal(56));
  readonly s57 = counted(signal(57));
  readonly s58 = counted(signal(58));
  readonly s59 = counted(signal(59));
  readonly s60 = counted(signal(60));
  readonly s61 = counted(signal(61));
  readonly s62 = counted(signal(62));
  readonly s63 = counted(signal(63));
  readonly s64 = counted(signal(64));
  readonly s65 = counted(signal(65));
  readonly s66 = counted(signal(66));
  readonly s67 = counted(signal(67));
  readonly s68 = counted(signal(68));
  readonly s69 = counted(signal(69));
  readonly s70 = counted(signal(70));
  readonly s71 = counted(signal(71));
  readonly s72 = counted(signal(72));
  readonly s73 = counted(signal(73));
  readonly s74 = counted(signal(74));
  readonly s75 = counted(signal(75));
  readonly s76 = counted(signal(76));
  readonly s77 = counted(signal(77));
  readonly s78 = counted(signal(78));
  readonly s79 = counted(signal(79));
  readonly s80 = counted(signal(80));
  readonly s81 = counted(signal(81));
  readonly s82 = counted(signal(82));
  readonly s83 = counted(signal(83));
  readonly s84 = counted(signal(84));
  readonly s85 = counted(signal(85));
  readonly s86 = counted(signal(86));
  readonly s87 = counted(signal(87));
  readonly s88 = counted(signal(88));
  readonly s89 = counted(signal(89));
  readonly s90 = counted(signal(90));
  readonly s91 = counted(signal(91));
  readonly s92 = counted(signal(92));
  readonly s93 = counted(signal(93));
  readonly s94 = counted(signal(94));
  readonly s95 = counted(signal(95));
  readonly s96 = counted(signal(96));
  readonly s97 = counted(signal(97));
  readonly s98 = counted(signal(98));
  readonly s99 = counted(signal(99));
  readonly s100 = counted(signal(100));
  readonly s101 = counted(signal(101));
  readonly s102 = counted(signal(102));
  readonly s103 = counted(signal(103));
  readonly s104 = counted(signal(104));
  readonly s105 = counted(signal(105));
  readonly s106 = counted(signal(106));
  readonly s107 = counted(signal(107));
  readonly s108 = counted(signal(108));
  readonly s109 = counted(signal(109));
  readonly s110 = counted(signal(110));
  readonly s111 = counted(signal(111));
  readonly s112 = counted(signal(112));
  readonly s113 = counted(signal(113));
  readonly s114 = counted(signal(114));
  readonly s115 = counted(signal(115));
  readonly s116 = counted(signal(116));
  readonly s117 = counted(signal(117));
  readonly s118 = counted(signal(118));
  readonly s119 = counted(signal(119));
  readonly s120 = counted(signal(120));
  readonly s121 = counted(signal(121));
  readonly s122 = counted(signal(122));
  readonly s123 = counted(signal(123));
  readonly s124 = counted(signal(124));
  readonly s125 = counted(signal(125));
  readonly s126 = counted(signal(126));
  readonly s127 = counted(signal(127));
  readonly s128 = counted(signal(128));
  readonly s129 = counted(signal(129));
  readonly s130 = counted(signal(130));
  readonly s131 = counted(signal(131));
  readonly s132 = counted(signal(132));
  readonly s133 = counted(signal(133));
  readonly s134 = counted(signal(134));
  readonly s135 = counted(signal(135));
  readonly s136 = counted(signal(136));
  readonly s137 = counted(signal(137));
  readonly s138 = counted(signal(138));
  readonly s139 = counted(signal(139));
  readonly s140 = counted(signal(140));
  readonly s141 = counted(signal(141));
  readonly s142 = counted(signal(142));
  readonly s143 = counted(signal(143));
  readonly s144 = counted(signal(144));
  readonly s145 = counted(signal(145));
  readonly s146 = counted(signal(146));
  readonly s147 = counted(signal(147));
  readonly s148 = counted(signal(148));
  readonly s149 = counted(signal(149));
  readonly s150 = counted(signal(150));
  readonly s151 = counted(signal(151));
  readonly s152 = counted(signal(152));
  readonly s153 = counted(signal(153));
  readonly s154 = counted(signal(154));
  readonly s155 = counted(signal(155));
  readonly s156 = counted(signal(156));
  readonly s157 = counted(signal(157));
  readonly s158 = counted(signal(158));
  readonly s159 = counted(signal(159));
  readonly s160 = counted(signal(160));
  readonly s161 = counted(signal(161));
  readonly s162 = counted(signal(162));
  readonly s163 = counted(signal(163));
  readonly s164 = counted(signal(164));
  readonly s165 = counted(signal(165));
  readonly s166 = counted(signal(166));
  readonly s167 = counted(signal(167));
  readonly s168 = counted(signal(168));
  readonly s169 = counted(signal(169));
  readonly s170 = counted(signal(170));
  readonly s171 = counted(signal(171));
  readonly s172 = counted(signal(172));
  readonly s173 = counted(signal(173));
  readonly s174 = counted(signal(174));
  readonly s175 = counted(signal(175));
  readonly s176 = counted(signal(176));
  readonly s177 = counted(signal(177));
  readonly s178 = counted(signal(178));
  readonly s179 = counted(signal(179));
  readonly s180 = counted(signal(180));
  readonly s181 = counted(signal(181));
  readonly s182 = counted(signal(182));
  readonly s183 = counted(signal(183));
  readonly s184 = counted(signal(184));
  readonly s185 = counted(signal(185));
  readonly s186 = counted(signal(186));
  readonly s187 = counted(signal(187));
  readonly s188 = counted(signal(188));
  readonly s189 = counted(signal(189));
  readonly s190 = counted(signal(190));
  readonly s191 = counted(signal(191));
  readonly s192 = counted(signal(192));
  readonly s193 = counted(signal(193));
  readonly s194 = counted(signal(194));
  readonly s195 = counted(signal(195));
  readonly s196 = counted(signal(196));
  readonly s197 = counted(signal(197));
  readonly s198 = counted(signal(198));
  readonly s199 = counted(signal(199));
  readonly s200 = counted(signal(200));
  readonly s201 = counted(signal(201));
  readonly s202 = counted(signal(202));
  readonly s203 = counted(signal(203));
  readonly s204 = counted(signal(204));
  readonly s205 = counted(signal(205));
  readonly s206 = counted(signal(206));
  readonly s207 = counted(signal(207));
  readonly s208 = counted(signal(208));
  readonly s209 = counted(signal(209));
  readonly s210 = counted(signal(210));
  readonly s211 = counted(signal(211));
  readonly s212 = counted(signal(212));
  readonly s213 = counted(signal(213));
  readonly s214 = counted(signal(214));
  readonly s215 = counted(signal(215));
  readonly s216 = counted(signal(216));
  readonly s217 = counted(signal(217));
  readonly s218 = counted(signal(218));
  readonly s219 = counted(signal(219));
  readonly s220 = counted(signal(220));
  readonly s221 = counted(signal(221));
  readonly s222 = counted(signal(222));
  readonly s223 = counted(signal(223));
  readonly s224 = counted(signal(224));
  readonly s225 = counted(signal(225));
  readonly s226 = counted(signal(226));
  readonly s227 = counted(signal(227));
  readonly s228 = counted(signal(228));
  readonly s229 = counted(signal(229));
  readonly s230 = counted(signal(230));
  readonly s231 = counted(signal(231));
  readonly s232 = counted(signal(232));
  readonly s233 = counted(signal(233));
  readonly s234 = counted(signal(234));
  readonly s235 = counted(signal(235));
  readonly s236 = counted(signal(236));
  readonly s237 = counted(signal(237));
  readonly s238 = counted(signal(238));
  readonly s239 = counted(signal(239));
  readonly s240 = counted(signal(240));
  readonly s241 = counted(signal(241));
  readonly s242 = counted(signal(242));
  readonly s243 = counted(signal(243));
  readonly s244 = counted(signal(244));
  readonly s245 = counted(signal(245));
  readonly s246 = counted(signal(246));
  readonly s247 = counted(signal(247));
  readonly s248 = counted(signal(248));
  readonly s249 = counted(signal(249));
  readonly s250 = counted(signal(250));
  readonly s251 = counted(signal(251));
  readonly s252 = counted(signal(252));
  readonly s253 = counted(signal(253));
  readonly s254 = counted(signal(254));
  readonly s255 = counted(signal(255));
  readonly s256 = counted(signal(256));
  readonly s257 = counted(signal(257));
  readonly s258 = counted(signal(258));
  readonly s259 = counted(signal(259));
  readonly s260 = counted(signal(260));
  readonly s261 = counted(signal(261));
  readonly s262 = counted(signal(262));
  readonly s263 = counted(signal(263));
  readonly s264 = counted(signal(264));
  readonly s265 = counted(signal(265));
  readonly s266 = counted(signal(266));
  readonly s267 = counted(signal(267));
  readonly s268 = counted(signal(268));
  readonly s269 = counted(signal(269));
  readonly s270 = counted(signal(270));
  readonly s271 = counted(signal(271));
  readonly s272 = counted(signal(272));
  readonly s273 = counted(signal(273));
  readonly s274 = counted(signal(274));
  readonly s275 = counted(signal(275));
  readonly s276 = counted(signal(276));
  readonly s277 = counted(signal(277));
  readonly s278 = counted(signal(278));
  readonly s279 = counted(signal(279));
  readonly s280 = counted(signal(280));
  readonly s281 = counted(signal(281));
  readonly s282 = counted(signal(282));
  readonly s283 = counted(signal(283));
  readonly s284 = counted(signal(284));
  readonly s285 = counted(signal(285));
  readonly s286 = counted(signal(286));
  readonly s287 = counted(signal(287));
  readonly s288 = counted(signal(288));
  readonly s289 = counted(signal(289));
  readonly s290 = counted(signal(290));
  readonly s291 = counted(signal(291));
  readonly s292 = counted(signal(292));
  readonly s293 = counted(signal(293));
  readonly s294 = counted(signal(294));
  readonly s295 = counted(signal(295));
  readonly s296 = counted(signal(296));
  readonly s297 = counted(signal(297));
  readonly s298 = counted(signal(298));
  readonly s299 = counted(signal(299));
  readonly s300 = counted(signal(300));
  readonly s301 = counted(signal(301));
  readonly s302 = counted(signal(302));
  readonly s303 = counted(signal(303));
  readonly s304 = counted(signal(304));
  readonly s305 = counted(signal(305));
  readonly s306 = counted(signal(306));
  readonly s307 = counted(signal(307));
  readonly s308 = counted(signal(308));
  readonly s309 = counted(signal(309));
  readonly s310 = counted(signal(310));
  readonly s311 = counted(signal(311));
  readonly s312 = counted(signal(312));
  readonly s313 = counted(signal(313));
  readonly s314 = counted(signal(314));
  readonly s315 = counted(signal(315));
  readonly s316 = counted(signal(316));
  readonly s317 = counted(signal(317));
  readonly s318 = counted(signal(318));
  readonly s319 = counted(signal(319));
  readonly s320 = counted(signal(320));
  readonly s321 = counted(signal(321));
  readonly s322 = counted(signal(322));
  readonly s323 = counted(signal(323));
  readonly s324 = counted(signal(324));
  readonly s325 = counted(signal(325));
  readonly s326 = counted(signal(326));
  readonly s327 = counted(signal(327));
  readonly s328 = counted(signal(328));
  readonly s329 = counted(signal(329));
  readonly s330 = counted(signal(330));
  readonly s331 = counted(signal(331));
  readonly s332 = counted(signal(332));
  readonly s333 = counted(signal(333));
  readonly s334 = counted(signal(334));
  readonly s335 = counted(signal(335));
  readonly s336 = counted(signal(336));
  readonly s337 = counted(signal(337));
  readonly s338 = counted(signal(338));
  readonly s339 = counted(signal(339));
  readonly s340 = counted(signal(340));
  readonly s341 = counted(signal(341));
  readonly s342 = counted(signal(342));
  readonly s343 = counted(signal(343));
  readonly s344 = counted(signal(344));
  readonly s345 = counted(signal(345));
  readonly s346 = counted(signal(346));
  readonly s347 = counted(signal(347));
  readonly s348 = counted(signal(348));
  readonly s349 = counted(signal(349));
  readonly s350 = counted(signal(350));
  readonly s351 = counted(signal(351));
  readonly s352 = counted(signal(352));
  readonly s353 = counted(signal(353));
  readonly s354 = counted(signal(354));
  readonly s355 = counted(signal(355));
  readonly s356 = counted(signal(356));
  readonly s357 = counted(signal(357));
  readonly s358 = counted(signal(358));
  readonly s359 = counted(signal(359));
  readonly s360 = counted(signal(360));
  readonly s361 = counted(signal(361));
  readonly s362 = counted(signal(362));
  readonly s363 = counted(signal(363));
  readonly s364 = counted(signal(364));
  readonly s365 = counted(signal(365));
  readonly s366 = counted(signal(366));
  readonly s367 = counted(signal(367));
  readonly s368 = counted(signal(368));
  readonly s369 = counted(signal(369));
  readonly s370 = counted(signal(370));
  readonly s371 = counted(signal(371));
  readonly s372 = counted(signal(372));
  readonly s373 = counted(signal(373));
  readonly s374 = counted(signal(374));
  readonly s375 = counted(signal(375));
  readonly s376 = counted(signal(376));
  readonly s377 = counted(signal(377));
  readonly s378 = counted(signal(378));
  readonly s379 = counted(signal(379));
  readonly s380 = counted(signal(380));
  readonly s381 = counted(signal(381));
  readonly s382 = counted(signal(382));
  readonly s383 = counted(signal(383));
  readonly s384 = counted(signal(384));
  readonly s385 = counted(signal(385));
  readonly s386 = counted(signal(386));
  readonly s387 = counted(signal(387));
  readonly s388 = counted(signal(388));
  readonly s389 = counted(signal(389));
  readonly s390 = counted(signal(390));
  readonly s391 = counted(signal(391));
  readonly s392 = counted(signal(392));
  readonly s393 = counted(signal(393));
  readonly s394 = counted(signal(394));
  readonly s395 = counted(signal(395));
  readonly s396 = counted(signal(396));
  readonly s397 = counted(signal(397));
  readonly s398 = counted(signal(398));
  readonly s399 = counted(signal(399));
  readonly s400 = counted(signal(400));
  readonly s401 = counted(signal(401));
  readonly s402 = counted(signal(402));
  readonly s403 = counted(signal(403));
  readonly s404 = counted(signal(404));
  readonly s405 = counted(signal(405));
  readonly s406 = counted(signal(406));
  readonly s407 = counted(signal(407));
  readonly s408 = counted(signal(408));
  readonly s409 = counted(signal(409));
  readonly s410 = counted(signal(410));
  readonly s411 = counted(signal(411));
  readonly s412 = counted(signal(412));
  readonly s413 = counted(signal(413));
  readonly s414 = counted(signal(414));
  readonly s415 = counted(signal(415));
  readonly s416 = counted(signal(416));
  readonly s417 = counted(signal(417));
  readonly s418 = counted(signal(418));
  readonly s419 = counted(signal(419));
  readonly s420 = counted(signal(420));
  readonly s421 = counted(signal(421));
  readonly s422 = counted(signal(422));
  readonly s423 = counted(signal(423));
  readonly s424 = counted(signal(424));
  readonly s425 = counted(signal(425));
  readonly s426 = counted(signal(426));
  readonly s427 = counted(signal(427));
  readonly s428 = counted(signal(428));
  readonly s429 = counted(signal(429));
  readonly s430 = counted(signal(430));
  readonly s431 = counted(signal(431));
  readonly s432 = counted(signal(432));
  readonly s433 = counted(signal(433));
  readonly s434 = counted(signal(434));
  readonly s435 = counted(signal(435));
  readonly s436 = counted(signal(436));
  readonly s437 = counted(signal(437));
  readonly s438 = counted(signal(438));
  readonly s439 = counted(signal(439));
  readonly s440 = counted(signal(440));
  readonly s441 = counted(signal(441));
  readonly s442 = counted(signal(442));
  readonly s443 = counted(signal(443));
  readonly s444 = counted(signal(444));
  readonly s445 = counted(signal(445));
  readonly s446 = counted(signal(446));
  readonly s447 = counted(signal(447));
  readonly s448 = counted(signal(448));
  readonly s449 = counted(signal(449));
  readonly s450 = counted(signal(450));
  readonly s451 = counted(signal(451));
  readonly s452 = counted(signal(452));
  readonly s453 = counted(signal(453));
  readonly s454 = counted(signal(454));
  readonly s455 = counted(signal(455));
  readonly s456 = counted(signal(456));
  readonly s457 = counted(signal(457));
  readonly s458 = counted(signal(458));
  readonly s459 = counted(signal(459));
  readonly s460 = counted(signal(460));
  readonly s461 = counted(signal(461));
  readonly s462 = counted(signal(462));
  readonly s463 = counted(signal(463));
  readonly s464 = counted(signal(464));
  readonly s465 = counted(signal(465));
  readonly s466 = counted(signal(466));
  readonly s467 = counted(signal(467));
  readonly s468 = counted(signal(468));
  readonly s469 = counted(signal(469));
  readonly s470 = counted(signal(470));
  readonly s471 = counted(signal(471));
  readonly s472 = counted(signal(472));
  readonly s473 = counted(signal(473));
  readonly s474 = counted(signal(474));
  readonly s475 = counted(signal(475));
  readonly s476 = counted(signal(476));
  readonly s477 = counted(signal(477));
  readonly s478 = counted(signal(478));
  readonly s479 = counted(signal(479));
  readonly s480 = counted(signal(480));
  readonly s481 = counted(signal(481));
  readonly s482 = counted(signal(482));
  readonly s483 = counted(signal(483));
  readonly s484 = counted(signal(484));
  readonly s485 = counted(signal(485));
  readonly s486 = counted(signal(486));
  readonly s487 = counted(signal(487));
  readonly s488 = counted(signal(488));
  readonly s489 = counted(signal(489));
  readonly s490 = counted(signal(490));
  readonly s491 = counted(signal(491));
  readonly s492 = counted(signal(492));
  readonly s493 = counted(signal(493));
  readonly s494 = counted(signal(494));
  readonly s495 = counted(signal(495));
  readonly s496 = counted(signal(496));
  readonly s497 = counted(signal(497));
  readonly s498 = counted(signal(498));
  readonly s499 = counted(signal(499));
  readonly s500 = counted(signal(500));
  readonly s501 = counted(signal(501));
  readonly s502 = counted(signal(502));
  readonly s503 = counted(signal(503));
  readonly s504 = counted(signal(504));
  readonly s505 = counted(signal(505));
  readonly s506 = counted(signal(506));
  readonly s507 = counted(signal(507));
  readonly s508 = counted(signal(508));
  readonly s509 = counted(signal(509));
  readonly s510 = counted(signal(510));
  readonly s511 = counted(signal(511));
  readonly s512 = counted(signal(512));
  readonly s513 = counted(signal(513));
  readonly s514 = counted(signal(514));
  readonly s515 = counted(signal(515));
  readonly s516 = counted(signal(516));
  readonly s517 = counted(signal(517));
  readonly s518 = counted(signal(518));
  readonly s519 = counted(signal(519));
  readonly s520 = counted(signal(520));
  readonly s521 = counted(signal(521));
  readonly s522 = counted(signal(522));
  readonly s523 = counted(signal(523));
  readonly s524 = counted(signal(524));
  readonly s525 = counted(signal(525));
  readonly s526 = counted(signal(526));
  readonly s527 = counted(signal(527));
  readonly s528 = counted(signal(528));
  readonly s529 = counted(signal(529));
  readonly s530 = counted(signal(530));
  readonly s531 = counted(signal(531));
  readonly s532 = counted(signal(532));
  readonly s533 = counted(signal(533));
  readonly s534 = counted(signal(534));
  readonly s535 = counted(signal(535));
  readonly s536 = counted(signal(536));
  readonly s537 = counted(signal(537));
  readonly s538 = counted(signal(538));
  readonly s539 = counted(signal(539));
  readonly s540 = counted(signal(540));
  readonly s541 = counted(signal(541));
  readonly s542 = counted(signal(542));
  readonly s543 = counted(signal(543));
  readonly s544 = counted(signal(544));
  readonly s545 = counted(signal(545));
  readonly s546 = counted(signal(546));
  readonly s547 = counted(signal(547));
  readonly s548 = counted(signal(548));
  readonly s549 = counted(signal(549));
  readonly s550 = counted(signal(550));
  readonly s551 = counted(signal(551));
  readonly s552 = counted(signal(552));
  readonly s553 = counted(signal(553));
  readonly s554 = counted(signal(554));
  readonly s555 = counted(signal(555));
  readonly s556 = counted(signal(556));
  readonly s557 = counted(signal(557));
  readonly s558 = counted(signal(558));
  readonly s559 = counted(signal(559));
  readonly s560 = counted(signal(560));
  readonly s561 = counted(signal(561));
  readonly s562 = counted(signal(562));
  readonly s563 = counted(signal(563));
  readonly s564 = counted(signal(564));
  readonly s565 = counted(signal(565));
  readonly s566 = counted(signal(566));
  readonly s567 = counted(signal(567));
  readonly s568 = counted(signal(568));
  readonly s569 = counted(signal(569));
  readonly s570 = counted(signal(570));
  readonly s571 = counted(signal(571));
  readonly s572 = counted(signal(572));
  readonly s573 = counted(signal(573));
  readonly s574 = counted(signal(574));
  readonly s575 = counted(signal(575));
  readonly s576 = counted(signal(576));
  readonly s577 = counted(signal(577));
  readonly s578 = counted(signal(578));
  readonly s579 = counted(signal(579));
  readonly s580 = counted(signal(580));
  readonly s581 = counted(signal(581));
  readonly s582 = counted(signal(582));
  readonly s583 = counted(signal(583));
  readonly s584 = counted(signal(584));
  readonly s585 = counted(signal(585));
  readonly s586 = counted(signal(586));
  readonly s587 = counted(signal(587));
  readonly s588 = counted(signal(588));
  readonly s589 = counted(signal(589));
  readonly s590 = counted(signal(590));
  readonly s591 = counted(signal(591));
  readonly s592 = counted(signal(592));
  readonly s593 = counted(signal(593));
  readonly s594 = counted(signal(594));
  readonly s595 = counted(signal(595));
  readonly s596 = counted(signal(596));
  readonly s597 = counted(signal(597));
  readonly s598 = counted(signal(598));
  readonly s599 = counted(signal(599));
  readonly s600 = counted(signal(600));
  readonly s601 = counted(signal(601));
  readonly s602 = counted(signal(602));
  readonly s603 = counted(signal(603));
  readonly s604 = counted(signal(604));
  readonly s605 = counted(signal(605));
  readonly s606 = counted(signal(606));
  readonly s607 = counted(signal(607));
  readonly s608 = counted(signal(608));
  readonly s609 = counted(signal(609));
  readonly s610 = counted(signal(610));
  readonly s611 = counted(signal(611));
  readonly s612 = counted(signal(612));
  readonly s613 = counted(signal(613));
  readonly s614 = counted(signal(614));
  readonly s615 = counted(signal(615));
  readonly s616 = counted(signal(616));
  readonly s617 = counted(signal(617));
  readonly s618 = counted(signal(618));
  readonly s619 = counted(signal(619));
  readonly s620 = counted(signal(620));
  readonly s621 = counted(signal(621));
  readonly s622 = counted(signal(622));
  readonly s623 = counted(signal(623));
  readonly s624 = counted(signal(624));
  readonly s625 = counted(signal(625));
  readonly s626 = counted(signal(626));
  readonly s627 = counted(signal(627));
  readonly s628 = counted(signal(628));
  readonly s629 = counted(signal(629));
  readonly s630 = counted(signal(630));
  readonly s631 = counted(signal(631));
  readonly s632 = counted(signal(632));
  readonly s633 = counted(signal(633));
  readonly s634 = counted(signal(634));
  readonly s635 = counted(signal(635));
  readonly s636 = counted(signal(636));
  readonly s637 = counted(signal(637));
  readonly s638 = counted(signal(638));
  readonly s639 = counted(signal(639));
  readonly s640 = counted(signal(640));
  readonly s641 = counted(signal(641));
  readonly s642 = counted(signal(642));
  readonly s643 = counted(signal(643));
  readonly s644 = counted(signal(644));
  readonly s645 = counted(signal(645));
  readonly s646 = counted(signal(646));
  readonly s647 = counted(signal(647));
  readonly s648 = counted(signal(648));
  readonly s649 = counted(signal(649));
  readonly s650 = counted(signal(650));
  readonly s651 = counted(signal(651));
  readonly s652 = counted(signal(652));
  readonly s653 = counted(signal(653));
  readonly s654 = counted(signal(654));
  readonly s655 = counted(signal(655));
  readonly s656 = counted(signal(656));
  readonly s657 = counted(signal(657));
  readonly s658 = counted(signal(658));
  readonly s659 = counted(signal(659));
  readonly s660 = counted(signal(660));
  readonly s661 = counted(signal(661));
  readonly s662 = counted(signal(662));
  readonly s663 = counted(signal(663));
  readonly s664 = counted(signal(664));
  readonly s665 = counted(signal(665));
  readonly s666 = counted(signal(666));
  readonly s667 = counted(signal(667));
  readonly s668 = counted(signal(668));
  readonly s669 = counted(signal(669));
  readonly s670 = counted(signal(670));
  readonly s671 = counted(signal(671));
  readonly s672 = counted(signal(672));
  readonly s673 = counted(signal(673));
  readonly s674 = counted(signal(674));
  readonly s675 = counted(signal(675));
  readonly s676 = counted(signal(676));
  readonly s677 = counted(signal(677));
  readonly s678 = counted(signal(678));
  readonly s679 = counted(signal(679));
  readonly s680 = counted(signal(680));
  readonly s681 = counted(signal(681));
  readonly s682 = counted(signal(682));
  readonly s683 = counted(signal(683));
  readonly s684 = counted(signal(684));
  readonly s685 = counted(signal(685));
  readonly s686 = counted(signal(686));
  readonly s687 = counted(signal(687));
  readonly s688 = counted(signal(688));
  readonly s689 = counted(signal(689));
  readonly s690 = counted(signal(690));
  readonly s691 = counted(signal(691));
  readonly s692 = counted(signal(692));
  readonly s693 = counted(signal(693));
  readonly s694 = counted(signal(694));
  readonly s695 = counted(signal(695));
  readonly s696 = counted(signal(696));
  readonly s697 = counted(signal(697));
  readonly s698 = counted(signal(698));
  readonly s699 = counted(signal(699));
  readonly s700 = counted(signal(700));
  readonly s701 = counted(signal(701));
  readonly s702 = counted(signal(702));
  readonly s703 = counted(signal(703));
  readonly s704 = counted(signal(704));
  readonly s705 = counted(signal(705));
  readonly s706 = counted(signal(706));
  readonly s707 = counted(signal(707));
  readonly s708 = counted(signal(708));
  readonly s709 = counted(signal(709));
  readonly s710 = counted(signal(710));
  readonly s711 = counted(signal(711));
  readonly s712 = counted(signal(712));
  readonly s713 = counted(signal(713));
  readonly s714 = counted(signal(714));
  readonly s715 = counted(signal(715));
  readonly s716 = counted(signal(716));
  readonly s717 = counted(signal(717));
  readonly s718 = counted(signal(718));
  readonly s719 = counted(signal(719));
  readonly s720 = counted(signal(720));
  readonly s721 = counted(signal(721));
  readonly s722 = counted(signal(722));
  readonly s723 = counted(signal(723));
  readonly s724 = counted(signal(724));
  readonly s725 = counted(signal(725));
  readonly s726 = counted(signal(726));
  readonly s727 = counted(signal(727));
  readonly s728 = counted(signal(728));
  readonly s729 = counted(signal(729));
  readonly s730 = counted(signal(730));
  readonly s731 = counted(signal(731));
  readonly s732 = counted(signal(732));
  readonly s733 = counted(signal(733));
  readonly s734 = counted(signal(734));
  readonly s735 = counted(signal(735));
  readonly s736 = counted(signal(736));
  readonly s737 = counted(signal(737));
  readonly s738 = counted(signal(738));
  readonly s739 = counted(signal(739));
  readonly s740 = counted(signal(740));
  readonly s741 = counted(signal(741));
  readonly s742 = counted(signal(742));
  readonly s743 = counted(signal(743));
  readonly s744 = counted(signal(744));
  readonly s745 = counted(signal(745));
  readonly s746 = counted(signal(746));
  readonly s747 = counted(signal(747));
  readonly s748 = counted(signal(748));
  readonly s749 = counted(signal(749));
  readonly s750 = counted(signal(750));
  readonly s751 = counted(signal(751));
  readonly s752 = counted(signal(752));
  readonly s753 = counted(signal(753));
  readonly s754 = counted(signal(754));
  readonly s755 = counted(signal(755));
  readonly s756 = counted(signal(756));
  readonly s757 = counted(signal(757));
  readonly s758 = counted(signal(758));
  readonly s759 = counted(signal(759));
  readonly s760 = counted(signal(760));
  readonly s761 = counted(signal(761));
  readonly s762 = counted(signal(762));
  readonly s763 = counted(signal(763));
  readonly s764 = counted(signal(764));
  readonly s765 = counted(signal(765));
  readonly s766 = counted(signal(766));
  readonly s767 = counted(signal(767));
  readonly s768 = counted(signal(768));
  readonly s769 = counted(signal(769));
  readonly s770 = counted(signal(770));
  readonly s771 = counted(signal(771));
  readonly s772 = counted(signal(772));
  readonly s773 = counted(signal(773));
  readonly s774 = counted(signal(774));
  readonly s775 = counted(signal(775));
  readonly s776 = counted(signal(776));
  readonly s777 = counted(signal(777));
  readonly s778 = counted(signal(778));
  readonly s779 = counted(signal(779));
  readonly s780 = counted(signal(780));
  readonly s781 = counted(signal(781));
  readonly s782 = counted(signal(782));
  readonly s783 = counted(signal(783));
  readonly s784 = counted(signal(784));
  readonly s785 = counted(signal(785));
  readonly s786 = counted(signal(786));
  readonly s787 = counted(signal(787));
  readonly s788 = counted(signal(788));
  readonly s789 = counted(signal(789));
  readonly s790 = counted(signal(790));
  readonly s791 = counted(signal(791));
  readonly s792 = counted(signal(792));
  readonly s793 = counted(signal(793));
  readonly s794 = counted(signal(794));
  readonly s795 = counted(signal(795));
  readonly s796 = counted(signal(796));
  readonly s797 = counted(signal(797));
  readonly s798 = counted(signal(798));
  readonly s799 = counted(signal(799));
  readonly s800 = counted(signal(800));
  readonly s801 = counted(signal(801));
  readonly s802 = counted(signal(802));
  readonly s803 = counted(signal(803));
  readonly s804 = counted(signal(804));
  readonly s805 = counted(signal(805));
  readonly s806 = counted(signal(806));
  readonly s807 = counted(signal(807));
  readonly s808 = counted(signal(808));
  readonly s809 = counted(signal(809));
  readonly s810 = counted(signal(810));
  readonly s811 = counted(signal(811));
  readonly s812 = counted(signal(812));
  readonly s813 = counted(signal(813));
  readonly s814 = counted(signal(814));
  readonly s815 = counted(signal(815));
  readonly s816 = counted(signal(816));
  readonly s817 = counted(signal(817));
  readonly s818 = counted(signal(818));
  readonly s819 = counted(signal(819));
  readonly s820 = counted(signal(820));
  readonly s821 = counted(signal(821));
  readonly s822 = counted(signal(822));
  readonly s823 = counted(signal(823));
  readonly s824 = counted(signal(824));
  readonly s825 = counted(signal(825));
  readonly s826 = counted(signal(826));
  readonly s827 = counted(signal(827));
  readonly s828 = counted(signal(828));
  readonly s829 = counted(signal(829));
  readonly s830 = counted(signal(830));
  readonly s831 = counted(signal(831));
  readonly s832 = counted(signal(832));
  readonly s833 = counted(signal(833));
  readonly s834 = counted(signal(834));
  readonly s835 = counted(signal(835));
  readonly s836 = counted(signal(836));
  readonly s837 = counted(signal(837));
  readonly s838 = counted(signal(838));
  readonly s839 = counted(signal(839));
  readonly s840 = counted(signal(840));
  readonly s841 = counted(signal(841));
  readonly s842 = counted(signal(842));
  readonly s843 = counted(signal(843));
  readonly s844 = counted(signal(844));
  readonly s845 = counted(signal(845));
  readonly s846 = counted(signal(846));
  readonly s847 = counted(signal(847));
  readonly s848 = counted(signal(848));
  readonly s849 = counted(signal(849));
  readonly s850 = counted(signal(850));
  readonly s851 = counted(signal(851));
  readonly s852 = counted(signal(852));
  readonly s853 = counted(signal(853));
  readonly s854 = counted(signal(854));
  readonly s855 = counted(signal(855));
  readonly s856 = counted(signal(856));
  readonly s857 = counted(signal(857));
  readonly s858 = counted(signal(858));
  readonly s859 = counted(signal(859));
  readonly s860 = counted(signal(860));
  readonly s861 = counted(signal(861));
  readonly s862 = counted(signal(862));
  readonly s863 = counted(signal(863));
  readonly s864 = counted(signal(864));
  readonly s865 = counted(signal(865));
  readonly s866 = counted(signal(866));
  readonly s867 = counted(signal(867));
  readonly s868 = counted(signal(868));
  readonly s869 = counted(signal(869));
  readonly s870 = counted(signal(870));
  readonly s871 = counted(signal(871));
  readonly s872 = counted(signal(872));
  readonly s873 = counted(signal(873));
  readonly s874 = counted(signal(874));
  readonly s875 = counted(signal(875));
  readonly s876 = counted(signal(876));
  readonly s877 = counted(signal(877));
  readonly s878 = counted(signal(878));
  readonly s879 = counted(signal(879));
  readonly s880 = counted(signal(880));
  readonly s881 = counted(signal(881));
  readonly s882 = counted(signal(882));
  readonly s883 = counted(signal(883));
  readonly s884 = counted(signal(884));
  readonly s885 = counted(signal(885));
  readonly s886 = counted(signal(886));
  readonly s887 = counted(signal(887));
  readonly s888 = counted(signal(888));
  readonly s889 = counted(signal(889));
  readonly s890 = counted(signal(890));
  readonly s891 = counted(signal(891));
  readonly s892 = counted(signal(892));
  readonly s893 = counted(signal(893));
  readonly s894 = counted(signal(894));
  readonly s895 = counted(signal(895));
  readonly s896 = counted(signal(896));
  readonly s897 = counted(signal(897));
  readonly s898 = counted(signal(898));
  readonly s899 = counted(signal(899));
  readonly s900 = counted(signal(900));
  readonly s901 = counted(signal(901));
  readonly s902 = counted(signal(902));
  readonly s903 = counted(signal(903));
  readonly s904 = counted(signal(904));
  readonly s905 = counted(signal(905));
  readonly s906 = counted(signal(906));
  readonly s907 = counted(signal(907));
  readonly s908 = counted(signal(908));
  readonly s909 = counted(signal(909));
  readonly s910 = counted(signal(910));
  readonly s911 = counted(signal(911));
  readonly s912 = counted(signal(912));
  readonly s913 = counted(signal(913));
  readonly s914 = counted(signal(914));
  readonly s915 = counted(signal(915));
  readonly s916 = counted(signal(916));
  readonly s917 = counted(signal(917));
  readonly s918 = counted(signal(918));
  readonly s919 = counted(signal(919));
  readonly s920 = counted(signal(920));
  readonly s921 = counted(signal(921));
  readonly s922 = counted(signal(922));
  readonly s923 = counted(signal(923));
  readonly s924 = counted(signal(924));
  readonly s925 = counted(signal(925));
  readonly s926 = counted(signal(926));
  readonly s927 = counted(signal(927));
  readonly s928 = counted(signal(928));
  readonly s929 = counted(signal(929));
  readonly s930 = counted(signal(930));
  readonly s931 = counted(signal(931));
  readonly s932 = counted(signal(932));
  readonly s933 = counted(signal(933));
  readonly s934 = counted(signal(934));
  readonly s935 = counted(signal(935));
  readonly s936 = counted(signal(936));
  readonly s937 = counted(signal(937));
  readonly s938 = counted(signal(938));
  readonly s939 = counted(signal(939));
  readonly s940 = counted(signal(940));
  readonly s941 = counted(signal(941));
  readonly s942 = counted(signal(942));
  readonly s943 = counted(signal(943));
  readonly s944 = counted(signal(944));
  readonly s945 = counted(signal(945));
  readonly s946 = counted(signal(946));
  readonly s947 = counted(signal(947));
  readonly s948 = counted(signal(948));
  readonly s949 = counted(signal(949));
  readonly s950 = counted(signal(950));
  readonly s951 = counted(signal(951));
  readonly s952 = counted(signal(952));
  readonly s953 = counted(signal(953));
  readonly s954 = counted(signal(954));
  readonly s955 = counted(signal(955));
  readonly s956 = counted(signal(956));
  readonly s957 = counted(signal(957));
  readonly s958 = counted(signal(958));
  readonly s959 = counted(signal(959));
  readonly s960 = counted(signal(960));
  readonly s961 = counted(signal(961));
  readonly s962 = counted(signal(962));
  readonly s963 = counted(signal(963));
  readonly s964 = counted(signal(964));
  readonly s965 = counted(signal(965));
  readonly s966 = counted(signal(966));
  readonly s967 = counted(signal(967));
  readonly s968 = counted(signal(968));
  readonly s969 = counted(signal(969));
  readonly s970 = counted(signal(970));
  readonly s971 = counted(signal(971));
  readonly s972 = counted(signal(972));
  readonly s973 = counted(signal(973));
  readonly s974 = counted(signal(974));
  readonly s975 = counted(signal(975));
  readonly s976 = counted(signal(976));
  readonly s977 = counted(signal(977));
  readonly s978 = counted(signal(978));
  readonly s979 = counted(signal(979));
  readonly s980 = counted(signal(980));
  readonly s981 = counted(signal(981));
  readonly s982 = counted(signal(982));
  readonly s983 = counted(signal(983));
  readonly s984 = counted(signal(984));
  readonly s985 = counted(signal(985));
  readonly s986 = counted(signal(986));
  readonly s987 = counted(signal(987));
  readonly s988 = counted(signal(988));
  readonly s989 = counted(signal(989));
  readonly s990 = counted(signal(990));
  readonly s991 = counted(signal(991));
  readonly s992 = counted(signal(992));
  readonly s993 = counted(signal(993));
  readonly s994 = counted(signal(994));
  readonly s995 = counted(signal(995));
  readonly s996 = counted(signal(996));
  readonly s997 = counted(signal(997));
  readonly s998 = counted(signal(998));
  readonly s999 = counted(signal(999));
  async test() {
    READS = 0;
    this.s0.set(999);
    await this.appRef.whenStable();
    console.log('reads for one write:', READS);
  }

  async time() {
    const writes = 1000, rounds = 5, batch = 50;
    const times: number[] = [];
    for (let r = 0; r < rounds; r++) {
      let elapsed = 0;
      for (let done = 0; done < writes; done += batch) {
        const t0 = performance.now();
        for (let i = 0; i < batch; i++) {
          this.s0.set(r * writes + done + i + 1);
          this.appRef.tick();
        }
        elapsed += performance.now() - t0;
        await new Promise((res) => setTimeout(res));   // new event-loop turn, not timed
      }
      times.push(elapsed);
    }
    times.sort((a, b) => a - b);
    console.log('median ms:', times[Math.floor(rounds / 2)]);
  }

}
