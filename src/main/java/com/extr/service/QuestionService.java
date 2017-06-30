package com.extr.service;

import com.extr.controller.domain.FalseQuestionResult;
import com.extr.controller.domain.QuestionFilter;
import com.extr.controller.domain.QuestionImproveResult;
import com.extr.controller.domain.QuestionQueryResult;
import com.extr.domain.question.*;
import com.extr.util.Page;

import java.util.HashMap;
import java.util.List;

/**
 * @author Ocelot
 * @date 2014�?6�?8�? 下午5:52:44
 */
public interface QuestionService {

	/**
	 * 获取题目类型
	 * 
	 * @return
	 */
	List<Field> getAllField(Page<Field> page);

	List<KnowledgePoint> getKnowledgePointByFieldId(int FieldId, Page<KnowledgePoint> page);

	List<Question> getQuestionList(Page<Question> pageModel, QuestionFilter qf);

	List<QuestionType> getQuestionTypeList();

	Question getQuestionByQuestionId(int questionId);

	/**
	 * 获取题目的知识点，知识点名由专业名fieldname和知识点pointname名拼�?
	 * 
	 * @param questionId
	 * @return
	 */
	List<KnowledgePoint> getQuestionKnowledgePointListByQuestionId(
			int questionId);

	/**
	 * 添加试题，同时添加试题知识点对应关系
	 * 
	 * @param question
	 */
	public void addQuestion(Question question);

	public void deleteQuestionByQuestionId(int questionId);

	public HashMap<Integer, HashMap<Integer, List<QuestionStruts>>> getQuestionStrutsMap(
			List<Integer> idList);

	public KnowledgePoint getKnowledgePointByName(String pointName,
												  String fieldName);

	/**
	 * 添加学员练习试题的记�?
	 * 
	 * @param userQuestionHistory
	 */
	public void addUserQuestionHistory(UserQuestionHistory userQuestionHistory)
			throws Exception;

	/**
	 * 获取学员练习试题的记�?
	 * 
	 * @param userId
	 * @return
	 */
	public UserQuestionHistory getUserQuestionHistoryByUserId(int userId);
	
	public List<UserQuestionHistory> getUserQuestionHistory();

	/**
	 * 更新学员练习试题记录
	 * 
	 * @param userQuestionHistory
	 */
	public void updateUserQuestionHistory(
			UserQuestionHistory userQuestionHistory) throws Exception;

	public List<QuestionQueryResult> getQuestionAnalysisListByPointIdAndTypeId(
			int typeId, int pointId);

	/**
	 * 强化练习获取分类信息
	 * 
	 * @return
	 */
	public List<QuestionImproveResult> getQuestionImproveResultByQuestionPointIdList(
			List<Integer> questionPointIdList);
	
	public List<QuestionQueryResult> getQuestionQueryResultListByFieldIdList(
			List<Integer> fieldIdList, List<Integer> typeIdList, int limit);
	
	public void updateQuestionPoint(Question question);
	
	/**
	 * 添加题库
	 * @param field
	 */
	public void addField(Field field);
	
	/**
	 * 添加知识�?
	 * @param point
	 */
	public void addKnowledgePoint(KnowledgePoint point);
	
	/**
	 * 删除题库
	 * @param idList
	 */
	public void deleteFieldByIdList(List<Integer> idList);
	
	/**
	 * 删除知识�?
	 * @param idList
	 */
	public void deleteKnowledgePointByIdList(List<Integer> idList);
	
	/**
	 * 上传试题
	 * @param filePath
	 * @param username
	 */
	public void uploadQuestions(String filePath, String username, int fieldId);
	
	/**
	 * 获取�?个最小的，具有point的fieldid，用于首页取默认field
	 * @return
	 */
	public Integer getMinFieldId();
	
	/**
     * 获取tag列表，包含所有公有的或�?�自己私有的
     *
     * @param userId
     * @param page
     * @return
     */
    public List<Tag> getTagByUserId(int userId, Page<Tag> page);

    /**
     * 增加�?个标�?
     *
     * @param tag
     */
    public void addTag(Tag tag);
    
    /**
	 * 获取试题的tag，只包含公有tag和自己的私有tag
	 * @param questionId
	 * @param userId
	 * @param page
	 * @return
	 */
	public List<QuestionTag> getQuestionTagByQuestionIdAndUserId(
			int questionId, int userId, Page<QuestionTag> page);
	
	/**
	 * 给题目打标签
	 * @param questionId
	 * @param userId
	 */
	public void addQuestionTag(int questionId, int userId, List<QuestionTag> questionTagList);
	
	/**
	 * 重载，整合了tag的功�?
	 * @see QuestionService#updateQuestionPoint(Question question)
	 * @param question
	 * @param userId
	 * @param questionTagList
	 */
	public void updateQuestionPoint(Question question, int userId, List<QuestionTag> questionTagList);
	
	
	public List<Question> getAllQuestion();
	
	List<FalseQuestionResult> getFalseQuestionResult();

	List<KnowledgePoint> getAllKnowledgePoint();
}
