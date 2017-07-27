package com.extr.controller;

import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.swing.*;

import com.extr.domain.question.Question;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.extr.controller.domain.QuestionImproveResult;
import com.extr.domain.exam.ExamPaper;
import com.extr.domain.question.KnowledgePoint;
import com.extr.domain.question.QuestionHistory;
import com.extr.domain.question.UserQuestionHistory;
import com.extr.security.UserInfo;
import com.extr.service.ExamService;
import com.extr.service.QuestionService;
import com.extr.service.UserService;
import com.extr.util.Page;

@Controller
public class BaseController {

	@Autowired
	private ExamService examService;
	@Autowired
	private UserService userService;
	@Autowired
	private QuestionService questionService;

	/**
	 * 网站首页
	 * 
	 * @param model
	 * @param request
	 * @return
	 */
	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String homePage(Model model, HttpServletRequest request) {

		return "redirect:home";
	}

	/**
	 * 管理员登陆
	 * 
	 * @param model
	 * @param request
	 * @return
	 */
	@RequestMapping(value = { "/admin/home" }, method = RequestMethod.GET)
	public String adminHomePage(Model model, HttpServletRequest request) {

		return "redirect:/admin/question-list";
	}

	/**
	 * 判断不同角色返回的页面
	 * @param model
	 * @param request
	 * @return
	 */
	@SuppressWarnings("deprecation")
	@RequestMapping(value = { "home" }, method = RequestMethod.GET)
	public String directToBaseHomePage(Model model, HttpServletRequest request) {

		String result = request.getParameter("result");
		if ("failed".equals(result)) {
			model.addAttribute("result_msg", "登陆失败");
		}

		if (SecurityContextHolder.getContext().getAuthentication() == null){
			this.appendBaseInfo(model);
			return "home";
		}
		if (SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString().endsWith("anonymousUser")){
			this.appendBaseInfo(model);
			return "home";
		}
		UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		Collection<? extends GrantedAuthority> grantedAuthorities = userDetails.getAuthorities();

		if (grantedAuthorities.contains(new GrantedAuthorityImpl("ROLE_ADMIN"))) {
			return "redirect:admin/home";
		} else if (grantedAuthorities.contains(new GrantedAuthorityImpl("ROLE_TEACHER"))) {
			return "redirect:teacher/home";
		} else if (grantedAuthorities.contains(new GrantedAuthorityImpl("ROLE_STUDENT"))) {
			this.appendBaseInfo(model);
			
			return "home";
		} else {
			return "home";
		}
	}
	
	
	/**
	 * 管理员登陆
	 * 
	 * @param model
	 * @param request
	 * @return
	 */
	@RequestMapping(value = { "/start-exam" }, method = RequestMethod.GET)
	public String startExam(Model model, HttpServletRequest request) {
		
		
		this.appendBaseInfo(model);
		
		return "start-exam";
	}

	
	public enum UserType {
		admin, teacher, student;
	}

	/**
	 * 首页初始化
	 * @param model
	 */
	public void appendBaseInfo(Model model){
		List<ExamPaper> historypaper = examService.getExamPaperList4Exam(1);
		List<ExamPaper> practicepaper = examService.getExamPaperList4Exam(2);
		List<ExamPaper> expertpaper = examService.getExamPaperList4Exam(3);
		

		Object userInfo = SecurityContextHolder.getContext()
			    .getAuthentication()
			    .getPrincipal();
		List<KnowledgePoint> kl =null;
		List<Integer> idList = new ArrayList<Integer>();
		Map<String,List<QuestionImproveResult>> classifyMap = new HashMap<String,List<QuestionImproveResult>>();
		int fieldId = questionService.getMinFieldId();
		UserQuestionHistory history = new UserQuestionHistory();
		if(userInfo instanceof String){
			kl = questionService.getKnowledgePointByFieldId(fieldId,null);
		}else{
			List<KnowledgePoint> kpz = questionService.getKnowledgePointByFieldId(fieldId,null);
			kl = questionService.getKnowledgePointByFieldId( ((UserInfo)userInfo).getFieldId(),null);
			
			kpz.addAll(kl);
			kl = kpz;
			history = questionService.getUserQuestionHistoryByUserId(((UserInfo)userInfo).getUserid());
		}
		for(KnowledgePoint klp : kl){
			idList.add(klp.getPointId());
		}
		//错题对应的知识点
		Map<String,Map<Integer,Integer>> wrongKnowledgeMap = new HashMap<String,Map<Integer,Integer>>();
		List<QuestionImproveResult> questionImproveList = questionService.getQuestionImproveResultByQuestionPointIdList(idList);
		Map<Integer,QuestionHistory> rightMap = new HashMap<Integer,QuestionHistory>();
		Map<Integer,QuestionHistory> wrongMap = new HashMap<Integer,QuestionHistory>();
		Map<Integer,QuestionHistory> otherMap = new HashMap<Integer,QuestionHistory>();
		if(history != null){
			if(history.getHistory() != null){
				if(history.getHistory().containsKey(1))
					rightMap = history.getHistory().get(1);
				if(history.getHistory().containsKey(0))
					wrongMap = history.getHistory().get(0);
				if(history.getHistory().containsKey(-1))
					otherMap = history.getHistory().get(-1);
			}
			
		}
		
		if(wrongMap != null){
			Iterator<Integer> it = wrongMap.keySet().iterator();
			while(it.hasNext()){
				int key = it.next();
				for(KnowledgePoint klp : kl){
					if(klp.getPointId() == wrongMap.get(key).getPointId()){
						Map<Integer,Integer> map = new HashMap<Integer,Integer>();
						if(wrongKnowledgeMap.containsKey(klp.getPointName())){
							map = wrongKnowledgeMap.get(klp.getPointName());
						} else {
							map.put(klp.getPointId(), 0);
						}
						map.put(klp.getPointId(), map.get(klp.getPointId()) + 1);
						wrongKnowledgeMap.put(klp.getPointName(), map);
					}
						
				}
			}
			
		}
		for(QuestionImproveResult qir : questionImproveList){
			List<QuestionImproveResult> tmpList = new ArrayList<QuestionImproveResult>();
			if(classifyMap.containsKey(qir.getQuestionPointName()))
				tmpList = classifyMap.get(qir.getQuestionPointName());
			else 
				tmpList = new ArrayList<QuestionImproveResult>();
			//错题总数和对题总数处理
			
			if(rightMap == null)
				qir.setRightTimes(0);
			else{
				Iterator<Integer> rightIt = rightMap.keySet().iterator();
				//客观题默认是正确的
				Iterator<Integer> otherIt = otherMap.keySet().iterator();
				int rightCount = 0;
				while(rightIt.hasNext()){
					int key = rightIt.next();
					QuestionHistory qh = rightMap.get(key);
					if(qh.getPointId() == qir.getQuestionPointId() && qh.getQuestionTypeId() == qir.getQuestionTypeId())
						rightCount ++;
				}
				while(otherIt.hasNext()){
					int key = otherIt.next();
					QuestionHistory qh = otherMap.get(key);
					if(qh.getPointId() == qir.getQuestionPointId() && qh.getQuestionTypeId() == qir.getQuestionTypeId())
						rightCount ++;
				}
				qir.setRightTimes(rightCount);
			}
			if(wrongMap == null)
				qir.setWrongTimes(0);
			else{
				Iterator<Integer> wrongIt = wrongMap.keySet().iterator();
				int wrongCount = 0;
				while(wrongIt.hasNext()){
					int key = wrongIt.next();
					QuestionHistory qh = wrongMap.get(key);
					if(qh.getPointId() == qir.getQuestionPointId() && qh.getQuestionTypeId() == qir.getQuestionTypeId())
						wrongCount ++;
					
				}
				qir.setWrongTimes(wrongCount);
			}
			tmpList.add(qir);
			classifyMap.put(qir.getQuestionPointName(), tmpList);
		}

		model.addAttribute("classifyMap", classifyMap);
		model.addAttribute("wrongKnowledgeMap", wrongKnowledgeMap);
		model.addAttribute("historypaper", historypaper);
		model.addAttribute("practicepaper", practicepaper);
		model.addAttribute("expertpaper", expertpaper);
		model.addAttribute("knowledgelist", kl);
		
	}



	@RequestMapping(value ={ "/restart-practise/{pointId}"},method = RequestMethod.GET)
	@ResponseBody
	public Object restartPratise(@PathVariable("pointId") int pointId){
		System.out.println(pointId);

		Object userInfo = SecurityContextHolder.getContext()
				.getAuthentication()
				.getPrincipal();

		UserQuestionHistory history = new UserQuestionHistory();
		history = questionService.getUserQuestionHistoryByUserId(((UserInfo)userInfo).getUserid());

		Map<Integer,QuestionHistory> rightMap = new HashMap<Integer,QuestionHistory>();
		Map<Integer,QuestionHistory> wrongMap = new HashMap<Integer,QuestionHistory>();
		Map<Integer,QuestionHistory> otherMap = new HashMap<Integer,QuestionHistory>();

		if(history != null){
			System.out.println("history is not NULL");
			if(history.getHistory() != null){
				if(history.getHistory().containsKey(1)){
					rightMap = history.getHistory().get(1);

					Iterator<Map.Entry<Integer,QuestionHistory>> iter = rightMap.entrySet().iterator();
					while (iter.hasNext()) {
						Map.Entry<Integer,QuestionHistory> entry=iter.next();
					QuestionHistory q=entry.getValue();
						if(q.getPointId()==pointId){
							iter.remove();
						}
					}

				}

				if(history.getHistory().containsKey(0)){
					wrongMap = history.getHistory().get(0);
					Iterator<Map.Entry<Integer,QuestionHistory>> iter = wrongMap.entrySet().iterator();
					while (iter.hasNext()) {
						Map.Entry<Integer,QuestionHistory> entry=iter.next();
						QuestionHistory q=entry.getValue();
						if(q.getPointId()==pointId){
							iter.remove();
						}
					}
				}

				if(history.getHistory().containsKey(-1)){
					otherMap = history.getHistory().get(-1);

				}
			}

		}
		Map<Integer, Map<Integer, QuestionHistory>> map = history.getHistory();
		map.put(1, rightMap);
		map.put(0,wrongMap);

		history.setHistory(map);

		try {
			questionService.updateUserQuestionHistory(history);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return history;
	}



}








