<template>
	<view class="jobContainer">
		<!-- 顶部 -->
		<topBar :nav="setNav" :loading="setLoading"></topBar>
		<!-- 简历列表 -->
		<view class="resumeContainer">
			<view class="btn" @click="getAllResume()" v-if="resumeList.length">
				批量导出简历
			</view>
			<view class="resumeBox" v-for="item in resumeList" :key="item.id" @click="seeDetail(item)">
				<view class="img" :style="{'backgroundImage':`url(${item.img})`}">
				</view>
				<view class="info">
					<view class="name">
						{{item.name}}
					</view>
					<view class="course common">
						<text>期望薪资</text>
						{{item.pay?item.pay:""}}
					</view>
					<view class="computer common">
						<text>求职职位</text>
						{{item.position?item.position:""}}
					</view>
					<view class="english common">
						<text>求职区域</text>
						{{item.city?item.city:""}}
					</view>
				</view>
			</view>
		</view>
		<view class="noData" v-if="resumeList.length == 0">
			暂无简历
		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setNav: {
					titleColor: "black",
					navTitle: "投递简历",
					bgColor: "white",
					isShowBackBtn: true,
					backBtnColor: "black"
				},
				// 表单
				form: {
					companyInfoId: "1e2e269ac0f1d01153b74e3970cbfb04",
					current: 1,
					limit: 2000
				},
				// 简历列表
				resumeList: []
			};
		},
		onLoad(options) {
			if (options.id)
				this.form.companyInfoId = options.id
			this.getSubmitResumeList()
		},
		methods: {
			// 获取简历列表
			async getSubmitResumeList() {
				let res = await this.$api.getSubmitResumeList(this.form)
				// console.log(res)
				this.resumeList = res.data.resume
			},
			// 查看简历详情
			seeDetail(item) {
				uni.navigateTo({
					url: `/pages/ResumeDetail/ResumeDetail?id=${item.id}`
				})
			},
			// 批量导出简历
			async getAllResume() {
				uni.showLoading()
				let res = await this.$api.getAllResume({
					interviewId: this.form.companyInfoId
				})
				console.log(res)
				let url = res.data.url
				uni.hideLoading()
				uni.showModal({
					title: "简历链接",
					content: url,
					confirmText: "复制",
					showCancel: false,
					success: function(res) {
						if (res.confirm) {
							uni.setClipboardData({
								data: url,
								success: () => {
									uni.showToast({
										icon: "none",
										title: '复制成功'
									})
								}
							});
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.jobContainer {
		padding-bottom: 150rpx;
		box-sizing: border-box;
		min-height: 100vh;
		background-color: #f5f5f5;
		user-select: text;
		-webkit-user-select: text;

		.resumeContainer {
			width: 100%;
			margin: 20rpx auto 0;

			.btn {
				background-color: #36c1ba;
				width: 90%;
				margin: 0 auto 20rpx;
				height: 80rpx;
				line-height: 90rpx;
				font-size: 30rpx;
				color: #FFFFFF;
				text-align: center;
				letter-spacing: 2rpx;
				border-radius: 10rpx;
			}

			.resumeBox {
				padding: 30rpx 5%;
				margin-bottom: 20rpx;
				background-color: #fff;
				border-radius: 14rpx;
				box-shadow: 0 4px 8px 1px rgba(100, 100, 100, 0.1), 0 6px 16px 1px rgba(140, 140, 140, 0.08);
				display: flex;
				justify-content: flex-start;

				.img {
					width: 160rpx;
					height: 160rpx;
					border-radius: 80rpx;
					box-shadow: 0 4px 8px 1px rgba(100, 100, 100, 0.1), 0 6px 16px 1px rgba(140, 140, 140, 0.08);
					background-position: center;
					background-repeat: no-repeat;
					background-size: cover;
				}

				.info {
					margin-left: 60rpx;

					.name {
						font-size: 36rpx;
						margin-bottom: 20rpx;
					}

					.common {
						margin-bottom: 10rpx;
						font-size: 26rpx;

						text {
							color: #999;
							font-size: 24rpx;
							display: inline-block;
							width: 110rpx;
						}
					}
				}
			}
		}

		.noData {
			margin: 300rpx auto;
			text-align: center;
			color: #999;
		}
	}
</style>
