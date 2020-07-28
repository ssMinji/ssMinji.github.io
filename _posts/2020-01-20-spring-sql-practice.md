---
layout: post
title: "[Spring] Spring + SQL + JSP를 활용해 간단한 데이터 조회 페이지 만들기"
---

# Spring

만약, sql db상에 직원 정보가 담긴 Emp 테이블이 있다고 하자. Emp 테이블은 직원의 ID와 이름을 담고 있으며, 이를 모두 조회해 보여주는 간단한 화면을 만든다고 가정하자.

- 개발 순서는?

STEP 1.  EMP테이블의 스키마를 담고있는 VO 코드 작성 

STEP 2. EMP 테이블로부터 모든 데이터를 가져오는 쿼리 작성 (DAO.xml)

STEP 3. 그 쿼리를 실행시키는 메소드 작성(DAO.java)

STEP 4. 메소드 구현 (Service.java)

STEP 5. 뷰 구현 (Controller.java)

STEP 6. Client 화면 구현 (.jsp)

위에서 설명한 개발 순서에 맞게 코드를 작성해본다. 해당 코드 파일과 소스코드를 따라가다보면, 자연스럽게 흐름을 이해할 수 있을 것이라고 생각한다. 

1. EmpVO.java

    ```java
    public class EmpVO {
        private String empID;
        private String empNM;
    
        public String getEmpID() {
            return empID;
        }
        public void setEmpID(String empID) {
            this.empID= empID;
        }
        public String getEmpNM() {
            return empNM;
        }
        public void setEmpNM(String empNM) {
            this.empNM= empNM;
        }
    }
    ```
    
2. EmpDAO.xml

    ```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" 
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
    <mapper namespace="com.fds.card.base.commoncode.dao.BaseCommoncodeDAO">
      <cache />
    
    <!-- 직원 정보 select 쿼리-->
    <select id="selectEmpInfo" parameterType="EmpVO" resultType="hashmap">
    USE DATABASE
    
    SELECT EMP_ID
    	, EMP_NM
    FROM EMP_INFO
    </select>
    </mapper>
    ```

3. EmpDAO.java

    ```java
    public interface EmpDAO {
    
    	/* 직원 정보 Select */
    	public List<HashMap<String, Object>> selectEmpInfo(EmpVO empVO) throws Exception;
    }
    ```    

4. EmpService.java

    ```java
    import java.util.ArrayList;
    import java.util.Arrays;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;
    
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.stereotype.Service;
    
    import com.fds.card.emp.dao.EmpDAO;
    import com.fds.vo.EmpVO;
    import com.google.gson.Gson;
    import com.google.gson.GsonBuilder;
    
    @Service
    public class EmpService {
    
        @Autowired
        EmpDAO empDAO;
    
        /* 직원 정보 Select */
        public List<EmpVO> selectEmpInfo(EmpVO empVO) throws Exception {
            List<HashMap<String, Object>> daoResultList = empDAO.selectEmpInfo(empVO);
            System.out.println("result of selectEmpInfo" + daoResultList);
    
            List<EmpVO> serviceResultList = createEmpList(daoResultList);
            return serviceResultList;
        }
    
        private ArrayList<EmpVO> createEmpList(List<HashMap<String, Object>> resultList) {
    
             ArrayList<EmpVO> arrayListEmpVO = new ArrayList<EmpVO>();
    
            for (HashMap<String, Object> tempMap : resultList) {
                // 필요 변수 초기화
                EmpVO empVO = new EmpVO();
    
                // 초기 값 할당
                empVO.setEmpID(String.valueOf(tempMap.get("EMP_ID")));
                empVO.setEmpNM(String.valueOf(tempMap.get("EMP_NM")));
    
                // arrayListEmp에 객체 추가
                arrayListEmpVO.add(empVO);
            }
    
            return arrayListEmpVO;
        }
    }
    ```

5. EmpController.java

    ```java
    @Controller
    @RequestMapping(value = "/emp/info")
    public class EmpController extends AbstractBaseControlller {
        Logger log = LoggerFactory.getLogger(EmpController.class);
    
        private static final String JSP_PREFIX = "emp/info/";
    
        @Autowired
        EmpService empService;
    
        @RequestMapping(value = "/goMaster.go")
        public String goBaseMerchant(@ModelAttribute("empVO") EmpVO empVO, HttpServletRequest request, HttpServletResponse response) {
    
            return JSP_PREFIX + "emp_info"; // 경로 내 emp_info.jsp파일로 연결
        }
    
        @ResponseBody
        @RequestMapping(value = "/doSelectEmp.do", method=RequestMethod.GET, produces="text/plain;charset=UTF-8")
        public String doSelectEmpInfo(HttpServletRequest request, HttpServletResponse response) {
    
            Gson gson = new GsonBuilder().setPrettyPrinting().create();	
            List<EmpVO> resultList = null;
    
            EmpVO empVO = new EmpVO();
            empVO.getEmpID();
            empVO.getEmpNM();
    
            try {			
    
                resultList = empService.selectEmpInfo(empVO);			
    
                return gson.toJson(resultList);
    
            } catch (Exception e) {
                log.debug("controller error  : " + e);
                e.printStackTrace();
                return "error";
            }
    
    }
    ```

6. emp_info.jsp

    ```java
    <%@ page contentType="text/html;charset=utf-8" pageEncoding="utf-8"%>
    <%@ taglib uri="http://www.opensymphony.com/sitemesh/decorator" prefix="decorator" %>
    <%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>
    <%
    	response.setHeader("Cache-Control", "no-cache");
    	response.setHeader("Pragma", "no-cache");
    	response.setDateHeader("Expires", 0);
    %>
    
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="ko" xml:lang="ko">
    <head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="description" content=""/>
    <meta name="author" content=""/>
    <script src="/common/js/plugins/proj4/lib/proj4js-combined.js"></script>
    
    
    <title>EMP INFO</title>
    <script type="text/javascript">
    
    
    function loadEmpData() {
    	var result = null;
    
    	$.ajax({
    		type : "get",
    		url : "/emp/info/doSelectEmpInfo.do",
    		async : true,
    		/* data : json_params, */
    		beforeSend : function() {
    			$.blockUI({
    				message : "<h2><img src='/common/img/loader.gif' /> loading... </h2>",
    				css : {
    					backgroundColor : "rgba(0,0,0,0.0)",
    					color : "#000000",
    					border : "0px solid #a00"
    				},
    				timeout : 600000
    			});
    		},
    		success : function(data, status) {
    			if (status != "success") {
    				alert("Not Found");
    				return;
    			}
    			console.log(data);
    			
    			result = JSON.parse(data); // 결과 저장
    			
    			console.log(result);
    
    			// jqgrid 세팅 --- 만약, 테이블 형식으로 뷰 구현한다면.
    			setEmpGrid(result);
    			$.unblockUI();
    		},
    		error : function(request, status, error) {
    			alert("error!!! " + error);
    			console.log(request, status);
    			$.unblockUI();
    		},
    	});
    
    	return result;
    }
    </script>
    </head>
    <body>
    // html 활용해 화면 구현 
    </body>
    ```


- Conclusion

SQL과 연동하여 간단한 테이블을 조회해보는 것을 실습해보았다. mybatis를 활용하면 xml파일에 따로 쿼리를 빼내어 작성할 수 있기 때문에 가독성이 좋다. 

각 흐름을 따라가다보면 느끼겠지만, 변수명과 메서드명을 일관성있게 규칙에 따라 작성하는 것이 좋다. 

jsp에서는 ajax를 사용해 비동기로 get 요청을 날려 함수를 호출 및 조회한다. 

위의 코드는 spring 설정 내에 bean 설정 및 mybatis 설정을 완료했다는 가정 하에 진행했는데, DB연동 및 설정에 관한 내용도 다루도록 하겠다. 