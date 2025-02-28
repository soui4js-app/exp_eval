import * as soui4 from "soui4";
import {R} from "uires/R.js";

var g_workDir="";

class MainDialog extends soui4.JsHostWnd{
	constructor(){
		super("layout:dlg_main");
		this.onEvt = this.onEvent;
	}

	onEvent(e){
		if(e.GetID()==soui4.EVT_INIT){//event_init
			this.init();
		}else if(e.GetID()==soui4.EVT_EXIT){
			this.uninit();
		}
		return false;
	}
	
	calculateExpression(expression) {
		try {
		  // 使用Function构造函数动态执行表达式
		  return new Function('return ' + expression)();
		} catch (e) {
		  // 如果有错误，返回错误信息
		  return 'Expression error: ' + e.message;
		}
	}

	onBtnCalc(e){
		let editInput = this.FindIChildByName("edit_input");
		let editOutput = this.FindIChildByName("edit_output");
		try{
			let strInput = editInput.GetWindowText(true);
			let strOutput = this.calculateExpression(strInput);
			editOutput.SetWindowText(""+strOutput);
		}catch(e){
			editOutput.SetWindowText("unknow exception");
		}
	}

	init(){
		console.log("init");
		let btn_calc = this.FindIChildByName("btn_calc");
		soui4.SConnect(btn_calc,soui4.EVT_CMD,this,this.onBtnCalc);
	}
	uninit(){
		//do uninit.
		console.log("uninit");
	}
};


function main(inst,workDir,args)
{
	soui4.log(workDir);
	g_workDir = workDir;
	let theApp = soui4.GetApp();
	let res = theApp.InitXmlNamedID(R.name_arr,R.id_arr);
	console.log("InitXmlNamedID ret:",res);
	let souiFac = soui4.CreateSouiFactory();
	//*
	let resProvider = souiFac.CreateResProvider(1);
	soui4.InitFileResProvider(resProvider,workDir + "/uires");
	//*/
	/*
	// show how to load resource from a zip file
	let resProvider = soui4.CreateZipResProvider(theApp,workDir +"/uires.zip","souizip");
	if(resProvider === 0){
		soui4.log("load res from uires.zip failed");
		return -1;
	}
	//*/
	let resMgr = theApp.GetResProviderMgr();
	resMgr.AddResProvider(resProvider,"uidef:xml_init");
	resProvider.Release();
	let hwnd = soui4.GetActiveWindow();
	let hostWnd = new MainDialog();
	hostWnd.Create(hwnd,0,0,0,0);
	hostWnd.SendMessage(0x110,0,0);//send init dialog message.
	hostWnd.ShowWindow(soui4.SW_SHOWNORMAL); 
	souiFac.Release();
	let ret= theApp.Run(hostWnd.GetHwnd());
	hostWnd=null;
	soui4.log("js quit");
	return ret;
}

globalThis.main=main;